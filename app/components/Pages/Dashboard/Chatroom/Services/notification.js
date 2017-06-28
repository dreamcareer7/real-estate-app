import store from '../../../../../stores'
import Chatroom from '../Util/chatroom'
import NotificationService from '../../../../../services/notification'
import {
  updateRoomNotifications,
  resetRoomNotificationsCounter,
  updateMessageDeliveries,
  acknowledgeRoom,
  addChatPopup
} from '../../../../../store_actions/chatroom'

export default class ChatNotification extends NotificationService {

  constructor(user) {
    super(user)

    // temporary variable to hold last room id that received notification
    this._lastRoomGotNotification = null

    const { scoket } = this
    socket.on('Notification.Delivered', this.onNotificationDelivered.bind(this))
    socket.on('Room.Acknowledged', this.onNotificationAcknowledged.bind(this))

    this.subscribe('UserSentMessage', this.onReceiveMessage.bind(this))

    // bind window focus
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.onFocusWindow.bind(this))
    }
  }

  /**
   * get state
   */
  getChatroomStore() {
    const { chatroom } = store.getState()
    return chatroom
  }

  /**
   * on focusing window
   */
  onFocusWindow() {
    const { chatroom } = store.getState()
    const { activeRoom } = chatroom

    if (activeRoom && activeRoom === this._lastRoomGotNotification) {
      ChatNotification.clear(activeRoom)
    }

    this._lastRoomGotNotification = null
  }


  /**
   * play ding sound
   */
  static playSound() {
    const audio = document.getElementById('chatroom-new-message')

    if (audio) {
      audio.play()
    }
  }

  /**
   * clear room notifications
   */
  static clear(roomId) {
    const { chatroom } = store.getState()
    const { rooms } = chatroom

    window.socket.emit('Room.Acknowledge', roomId)

    if (rooms[roomId] && ~~rooms[roomId].new_notifications === 0)
      return false

    store.dispatch(resetRoomNotificationsCounter(roomId))
  }

  /**
   * On new message event [UserSentMessage]
   */
  onReceiveMessage(chatroom, notification) {
    const { room, subjects, objects } = notification
    const { activeRoom } = chatroom
    const message = objects[0]

    // set value
    this._lastRoomGotNotification = room

    if (message.author && message.author.id === this.user.id)
      return false

    const isWindowActive = this.isWindowActive()

    // send browser notification if tab is not active
    if (!isWindowActive) {
      this.sendBrowserNotification({
        title: `New message from ${message.author.display_name}`,
        image: message.author.profile_image_url,
        body: message.comment
      }, () => {
        Chatroom.openChat(room)
      })
    }

    if (isWindowActive && activeRoom && room === activeRoom) {
      return ChatNotification.clear(room)
    }

    if (!isWindowActive && activeRoom && room === activeRoom) {
      this.updateRoomNotifications(room, message)
    }

    if (room !== activeRoom && message.author && message.author.id !== this.user.id) {
      this.updateRoomNotifications(room, message)

      // open chat popup but make it inactive
      Chatroom.openChat(room, false)

      // play sound
      ChatNotification.playSound()
    }
  }

  /**
   * on notification delivers to a user
   */
  onNotificationDelivered(response) {
    const { user, delivery_type, notification } = response
    const { messages } = this.getChatroomStore()

    if (!messages[notification.room])
      return false

    store.dispatch(updateMessageDeliveries(
      user,
      delivery_type,
      notification
    ))
  }

  /**
   * on notification acknowledge by a user
   */
  onNotificationAcknowledged(ack) {
    const { messages } = this.getChatroomStore()
    const { room, user } = ack

    if (ack.user === this.user.id || !messages[room])
      return false

    store.dispatch(acknowledgeRoom(room, user))
  }

  /**
   * update notifications of specific room
   */
  updateRoomNotifications(room, message) {
    store.dispatch(updateRoomNotifications(room, message))
  }
}
