// actions/create-room.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'

export default (user, title) => {
  const params = {
    title,
    owner: user.id,
    access_token: user.access_token
  }
  Room.create(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const new_room = response.data
      AppStore.data.status = 'success'
      AppStore.data.show_message = true
      AppStore.data.showCreateChatModal = false
      AppStore.data.rooms.unshift(new_room)
      AppStore.data.current_room = new_room
      AppStore.data.messages = [new_room.latest_message]
    } else {
      AppStore.data.status = 'error'
      AppStore.data.submitting = false
      AppStore.data.show_message = true
      AppStore.data.request_error = true
    }
    AppStore.emitChange()
  })
}