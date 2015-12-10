// Dashboard/Index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

// Partials
import MainContent from './Partials/MainContent'
import MainNav from './Partials/MainNav'
import SideBar from './Partials/SideBar'

export default class Dashboard extends Component {

  handleResize(){
    const data = AppStore.data
    AppStore.data.scroll_area_height = window.innerHeight - 172
    AppStore.emitChange()
  }

  componentDidMount() {
    
    const data = AppStore.data
    // Get messages
    if(data.rooms && !data.messages){
      let current_room = data.rooms[0]
      // Default to first room
      if(data.current_room)
        current_room = data.current_room
      this.getMessages(current_room)
    }
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  addUserToStore(){
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'add-user-to-store',
      user: user
    })
  }

  getUserRooms(){
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'get-rooms',
      user: user
    })
  }

  init(){
    let data = this.props.data
    data.scroll_area_height = window.innerHeight - 172
    this.addUserToStore()
    this.getUserRooms()
  }

  getMessages(current_room){
    const data = AppStore.data
    AppDispatcher.dispatch({
      action: 'get-messages',
      user: data.user,
      room: current_room
    })
  }

  componentWillMount(){
    this.init()
  }

  showModal(modal_key){
    AppDispatcher.dispatch({
      action: 'show-modal',
      modal_key: modal_key
    })
  }

  hideModal(){
    AppStore.data.showCreateChatModal = false
    AppStore.emitChange()
  }

  createRoom(title){
    
    const user = AppStore.data.user

    AppDispatcher.dispatch({
      action: 'create-room',
      user: user,
      title: title
    }) 
  }

  createMessage(e){
    e.preventDefault()
    const comment = this.refs.message_input.value
    const user = this.props.data.user
    const current_room = this.props.data.current_room

    AppDispatcher.dispatch({
      action: 'create-message',
      user: user,
      room: current_room,
      comment: comment
    }) 

    this.refs.message_input.value = ''

  }

  componentDidUpdate(){
    const data = AppStore.data
    // Get messages
    if(data.rooms && !data.messages){
      let current_room = data.rooms[0]
      // Default to first room
      if(data.current_room)
        current_room = data.current_room
      this.getMessages(current_room)
    }
  }

  render(){

    // Data
    let data = this.props.data
    data.rooms = AppStore.data.rooms
    data.current_room = AppStore.data.current_room
    data.messages = AppStore.data.messages
    data.showCreateChatModal = AppStore.data.showCreateChatModal
    data.scroll_area_height = AppStore.data.scroll_area_height

    if(this.props.route.path){
      data.path = this.props.route.path
    } else {
      data.path = '/dashboard'
    }

    // Style
    const main_style = S('absolute l-222 r-0')
    

    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <SideBar data={ data }/>
        <main style={ main_style }>
          <MainContent createMessage={ this.createMessage } showModal={ this.showModal } hideModal={ this.hideModal } createRoom={ this.createRoom } getMessages={ this.getMessages } data={ data }/>
        </main>
      </div>
    )
  }
}

// PropTypes
Dashboard.proptypes = {
  data: React.PropTypes.object.isRequired
}