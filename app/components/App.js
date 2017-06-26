import React, { Component } from 'react'
import { connect } from 'react-redux'
import S from 'shorti'
import AppDispatcher from '../dispatcher/AppDispatcher'

// services
import Socket from '../services/socket'

// navs
import SideBar from './Pages/Dashboard/Partials/SideBar'
import MobileNav from './Pages/Dashboard/Partials/MobileNav'

// global chat components
import { getRooms } from '../store_actions/chatroom'
import InstantChat from './Pages/Dashboard/Chatroom/InstantChat'

// contacts
import { getContacts } from '../store_actions/contact'

// import _ from 'lodash'
// import NotificationDispatcher from '../dispatcher/NotificationDispatcher'
import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'
import ReactGA from 'react-ga'
import config from '../../config/public'
import MobileDetect from 'mobile-detect'

class App extends Component {

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.initializeWebSocket()
    }
  }

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    // check branding
    Brand.checkBranding()

    // load rooms
    this.initialRooms()

    // load contacts
    this.initialContacts(user)

    // check user is mobile device or not
    this.checkForMobile()

    // set intercom
    this.setIntercom()

    if (user)
      this.triggerBranchBanner()

    if (typeof window !== 'undefined') {
      let md = new MobileDetect(window.navigator.userAgent)

      if (md.is('iPhone') && !data.is_widget)
        this.showMobileSplashViewer()
    }
  }

  initializeWebSocket() {
    const { user } = this.props.data
    const socket = new Socket(user)
  }

  initialRooms() {
    const { dispatch, data, rooms } = this.props

    if (data.user && !rooms) {
      dispatch(getRooms())
    }
  }

  initialContacts(user) {
    const { dispatch, contacts } = this.props

    if (user && !contacts) {
      dispatch(getContacts())
    }
  }

  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  // Add change listeners to stores
  // componentDidMount() {
  //   Brand.checkBranding()
  //   // AppStore.addChangeListener(this._onChange.bind(this))
  //   window.socket.on('reconnecting', () => {
  //     AppStore.data.socket_reconnecting = true
  //     AppStore.emitChange()
  //   })
  //   window.socket.on('reconnect', () => {
  //     window.socket.emit('Authenticate', AppStore.data.user.access_token)
  //     delete AppStore.data.socket_reconnecting
  //     AppStore.data.socket_reconnected = true
  //     const data = AppStore.data
  //     const current_room = data.current_room
  //     const user = data.user
  //     let room_id
  //     if (current_room)
  //       room_id = data.current_room.id
  //     AppDispatcher.dispatch({
  //       action: 'get-rooms',
  //       user,
  //       room_id
  //     })
  //     AppStore.emitChange()
  //     // Remove reconnected message after 3 seconds
  //     setTimeout(() => {
  //       delete AppStore.data.socket_reconnected
  //       AppStore.emitChange()
  //     }, 3000)
  //   })
  //   window.socket.on('ping', (cb) => {
  //     if (cb)
  //       cb(null, new Date())
  //   })
  //   // Check for mobile
  //   this.checkForMobile()
  //   // If logged in
  //   // const data = AppStore.data
  //   // if (data.user)
  //   //   this.triggerBranchBanner()
  //   const MobileDetect = require('mobile-detect')
  //   const md = new MobileDetect(window.navigator.userAgent)
  //   if (md.is('iPhone') && !AppStore.data.is_widget)
  //     this.showMobileSplashViewer()
  // }

  // componentDidUpdate() {
  //   const data = AppStore.data
  //   if (data.user && !data.session_started) {
  //     this.initSockets()
  //     AppStore.data.session_started = true
  //     AppStore.emitChange()
  //   }
  //   const brand = Brand.flatten(data.brand)
  //   if (brand && brand.assets.google_analytics_id && !data.brand_merged) {
  //     const google_analytics_id = brand.assets.google_analytics_id
  //     ReactGA.initialize(google_analytics_id)
  //     ReactGA.set({ page: window.location.pathname })
  //     ReactGA.pageview(window.location.pathname)
  //     AppStore.data.brand_merged = true
  //     AppStore.emitChange()
  //   }
  //   this.setIntercom()
  //   // get notifications once
  //   if (data.user && !data.getting_notifications && !data.notifications_retrieved) {
  //     AppStore.data.getting_notifications = true
  //     AppStore.emitChange()
  //     NotificationDispatcher.dispatch({
  //       action: 'get-all',
  //       user: data.user
  //     })
  //   }
  // }

  setIntercom() {
    const { data } = this.props
    if (!data.intercom_set && data.user) {
      window.intercomSettings = {
        app_id: 'pkzkvg9a',
        name: `${data.user.first_name} ${data.user.last_name}`, // Full name
        email: `${data.user.email}` // Email address
      }
      AppStore.data.intercom_set = true
      AppStore.emitChange()
    }
  }

  showMobileSplashViewer() {
    AppStore.data.show_mobile_splash_viewer = true
    this.createBranchLink()
    AppStore.emitChange()
  }

  createBranchLink() {
    const branch = require('branch-sdk')
    branch.init(config.branch.key)
    let branch_data = window.branchData

    if (!branch_data) {
      branch_data = {
        '$always_deeplink': true
      }
    }

    branch.link({
      data: branch_data
    }, (err, link) => {
      AppStore.data.branch_link = link
      AppStore.emitChange()
    })
  }

  triggerBranchBanner() {
    const branch = require('branch-sdk')
    branch.init(config.branch.key)
    branch.banner({
      icon: '/static/images/logo-big.png',
      title: 'Download the Rechat iOS app',
      description: 'For a better mobile experience',
      showDesktop: false,
      showAndroid: false,
      forgetHide: false,
      downloadAppButtonText: 'GET',
      openAppButtonText: 'OPEN',
      customCSS: '#branch-banner .button { color:  #3388ff; border-color: #3388ff; }'
    }, {
      data: {
        type: (AppStore.data.user ? 'WebBranchBannerClickedUser' : 'WebBranchBannerClickedShadowUser'),
        access_token: (AppStore.data.user ? AppStore.data.user.access_token : null)
      }
    })
  }

  // getNotifications(notification) {
  //   const data = AppStore.data
  //   NotificationDispatcher.dispatch({
  //     action: 'get-all',
  //     user: data.user
  //   })
  //   // Add notification to count
  //   if (notification.notification_type === 'UserSentMessage') {
  //     const room = notification.room
  //     const room_index = _.findIndex(data.rooms, { id: room })
  //     AppStore.data.rooms[room_index].new_notifications = AppStore.data.rooms[room_index].new_notifications + 1
  //     AppStore.emitChange()
  //   }
  // }

  // updateRoomsIndexedDB() {
  //   const data = AppStore.data
  //   const user = data.user
  //   AppDispatcher.dispatch({
  //     action: 'update-rooms-indexeddb',
  //     user_id: user.id
  //   })
  // }

  // initSockets() {
  //   window.socket_init = true
  //   const socket = window.socket
  //   const data = AppStore.data
  //   socket.emit('Authenticate', data.user.access_token)
  //   socket.on('Message.Sent', (room, message) => {
  //     const current_room = AppStore.data.current_room
  //     const rooms = AppStore.data.rooms
  //     // If in current room
  //     if (current_room && room && current_room.id === room.id) {
  //       if (message.author && data.user.id === message.author.id)
  //         message.fade_in = true
  //       if (AppStore.data.current_room) {
  //         if (!AppStore.data.current_room.messages)
  //           AppStore.data.current_room.messages = []
  //         AppStore.data.current_room.messages.push(message)
  //       }
  //       const current_room_index = _.findIndex(rooms, { id: current_room.id })
  //       AppStore.data.rooms[current_room_index].latest_message = message
  //       if (AppStore.data.rooms[current_room_index].messages && !_.find(AppStore.data.rooms[current_room_index].messages, { id: message.id }))
  //         AppStore.data.rooms[current_room_index].messages.push(message)
  //       AppStore.data.scroll_bottom = true
  //       if (message.author && data.user.id !== message.author.id)
  //         this.checkNotification(message)
  //     } else {
  //       // Add to not current room
  //       const message_room_index = _.findIndex(rooms, { id: room.id })
  //       // If room not found
  //       if (!AppStore.data.rooms || !AppStore.data.rooms[message_room_index])
  //         return
  //       if (!AppStore.data.rooms[message_room_index].messages)
  //         AppStore.data.rooms[message_room_index].messages = []
  //       AppStore.data.rooms[message_room_index].messages.push(message)
  //       AppStore.data.rooms[message_room_index].latest_message = message
  //       AppStore.data.rooms = _.sortBy(AppStore.data.rooms, (room_loop) => {
  //         if (room_loop.latest_message)
  //           return -room_loop.latest_message.created_at
  //       })
  //     }
  //     AppStore.emitChange()
  //     this.updateRoomsIndexedDB()
  //   })
  //   socket.on('User.Typing', (response) => {
  //     const author_id = response.user_id
  //     const room_id = response.room_id
  //     AppStore.data.is_typing = {
  //       author_id,
  //       room_id
  //     }
  //     delete AppStore.data.current_room.viewing_previous
  //     AppStore.emitChange()
  //   })
  //   socket.on('User.TypingEnded', () => {
  //     delete AppStore.data.is_typing
  //     AppStore.emitChange()
  //   })
  //   socket.on('Users.States', (response) => {
  //     const user_states = response
  //     const users_online = user_states.filter((user_state) => {
  //       if (user_state.state === 'Online' || user_state.state === 'Background')
  //         return true
  //     })
  //     const user_ids = _.map(users_online, 'user_id')
  //     AppStore.data.users_online = user_ids
  //     delete window.socket_init
  //     AppStore.emitChange()
  //   })
  //   socket.on('User.State', (state, user_id) => {
  //     // Prevent on init
  //     if (window.socket_init)
  //       return
  //     if (!AppStore.data.users_online)
  //       AppStore.data.users_online = []
  //     if (state === 'Online' || state === 'Background')
  //       AppStore.data.users_online.push(user_id)
  //     if (state === 'Offline') {
  //       AppStore.data.users_online = AppStore.data.users_online.filter((id) => {
  //         if (user_id !== id)
  //           return true
  //       })
  //     }
  //     AppStore.emitChange()
  //   })
  //   socket.on('Room.UserJoined', (user, room) => {
  //     setTimeout(() => {
  //       // Add users
  //       if (AppStore.data.rooms) {
  //         if (_.find(AppStore.data.rooms, { id: room.id })) {
  //           const index = _.findIndex(AppStore.data.rooms, { id: room.id })
  //           AppStore.data.rooms[index].users.push(user)
  //           AppStore.data.rooms[index].users = _.uniqBy(AppStore.data.rooms[index].users, 'id')
  //         } else {
  //           room.users = [user]
  //           AppStore.data.rooms = [
  //             room,
  //             ...AppStore.data.rooms
  //           ]
  //         }
  //       } else {
  //         room.users = [user]
  //         AppStore.data.rooms = [room]
  //       }
  //       // Get messages
  //       if (user.id === AppStore.data.user.id) {
  //         AppDispatcher.dispatch({
  //           action: 'get-room-and-messages',
  //           user: AppStore.data.user,
  //           room
  //         })
  //       }
  //     }, 1000)
  //   })


  // checkNotification(message) {
  //   if (!('Notification' in window))
  //     return false

  //   if (document && document.hasFocus())
  //     return false

  //   const Notification = window.Notification || window.mozNotification || window.webkitNotification

  //   if (Notification.permission === 'granted')
  //     this.sendNotification(message)
  //   else {
  //     Notification.requestPermission((permission) => {
  //       if (permission === 'granted')
  //         this.sendNotification(message)
  //     })
  //   }
  // }

  // sendNotification(message) {
  //   const profile_image_url = `${config.app.url}/static/images/dashboard/rebot@2x.png`
  //   let first_name = 'Rebot'
  //   if (message.author)
  //     first_name = message.author.first_name

  //   const title = `New message from ${first_name}`
  //   let comment = message.comment
  //   if (!comment)
  //     comment = 'File uploaded'
  //   const instance = new Notification(
  //     title, {
  //       body: comment,
  //       icon: profile_image_url,
  //       sound: '/static/audio/ding.mp3'
  //     }
  //   )
  //   instance.onclick = () => {
  //     window.focus()
  //   }
  //   instance.onshow = () => {
  //     AppStore.data.play_sound = true
  //     AppStore.emitChange()
  //   }
  // }

  render() {
    const { data, rooms, location } = this.props
    const { user } = data

    // don't remove below codes,
    // because app is depended to `path` and `location` props in data store
    const path = location.pathname
    data.path = path
    data.location = location

    const children = React.cloneElement(this.props.children, {
      data,
      user
    })

    // render sidebar
    const main_style = { minHeight: '100vh' }
    let nav_area = <SideBar data={data} />

    if (data.is_mobile && user) {
      nav_area = <MobileNav data={data} />
    }

    return (
      <div>
        {
          user && !data.is_widget &&
          nav_area
        }

        {
          user &&
          <InstantChat
            user={user}
            rooms={rooms}
          />
        }

        <main style={main_style}>
          { children }
        </main>
      </div>
    )
  }
}

export default connect(s => ({
  data: s.data,
  rooms: s.chatroom.rooms,
  contacts: s.chatroom.contact
}))(App)
