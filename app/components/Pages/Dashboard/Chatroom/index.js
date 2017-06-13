import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import Rooms from './Rooms'
import Messages from './Messages'
import Socket from '../../../../services/socket'
import {
  getRooms,
  changeActiveRoom,
  resetRoomNotificationsCounter
} from '../../../../store_actions/chatroom'

import store from '../../../../stores'

// set rooms container width
const roomsWidth = '330px'

class Chatroom extends React.Component {
  static fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getRooms(user))
  }

  componentWillMount() {
    const { activeRoom, params } = this.props
    const { rooms } = store.getState().chatroom

    if (params && params.roomId)
      return this.changeRoom(params.roomId)

    if (!activeRoom && _.size(rooms) > 0)
      return this.changeRoom(rooms[_.keys(rooms)[0]].id)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { activeRoom, location, isInstance } = this.props

    if (isInstance) {
      return nextProps.activeRoom !== undefined &&
        nextProps.instanceMode === true &&
        activeRoom !== nextProps.activeRoom
    }

    return nextProps.activeRoom !== undefined &&
      nextProps.location !== undefined &&
      activeRoom !== nextProps.activeRoom &&
      location.key !== nextProps.location.key
  }

  changeRoom(id) {
    const { instanceMode, changeActiveRoom, activeRoom, resetRoomNotificationsCounter }
      = this.props

    if (id !== activeRoom) {
      changeActiveRoom(id)

      // ack rooms notifications
      Socket.clearNotifications(id)
      resetRoomNotificationsCounter(id)
    }

    // don't change url on instance mode
    if (!instanceMode) {
      browserHistory.push(`/dashboard/recents/${id}`)
    }
  }

  getMessagesWidth() {
    const { instanceMode } = this.props
    const width = instanceMode ? roomsWidth : `calc(65px + ${roomsWidth})`

    return `calc(100vw - ${width})`
  }

  render() {
    const { user, activeRoom, isInstance } = this.props

    return (
      <div className="chatroom">
        <audio id="chatroom-new-message">
          <soruce src="/static/audio/ding.wav" type="audio/wav" />
          <source src="/static/audio/ding.mp3" type="audio/mpeg" />
        </audio>

        <div className="col-md-1 no-padding" style={{ width: roomsWidth }}>
          <Rooms
            handler={isInstance ? 'Instance': 'Router'}
            user={user}
            onSelectRoom={id => this.changeRoom(id)}
            activeRoom={activeRoom}
          />
        </div>

        <div
          className="col-md-1 no-padding"
          style={{ width: this.getMessagesWidth() }}
        >
          <Messages
            user={user}
            roomId={activeRoom}
            showToolbar={true}
          />
        </div>
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  instanceMode: chatroom.instanceMode,
  activeRoom: chatroom.activeRoom
}), ({ changeActiveRoom, resetRoomNotificationsCounter }))(Chatroom)
