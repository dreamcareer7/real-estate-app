import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import PendingIcon from 'components/SvgIcons/DealTaskPending/IconPending'

import { setSelectedTask, updateDealNotifications } from 'actions/deals'

import ActionButton from 'components/Button/ActionButton'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { Container, BadgeCounter } from './styled'

class MessageAdmin extends React.Component {
  getGeneralTaskId() {
    const taskId = _.find(
      this.props.checklist.tasks,
      id => this.props.tasks[id].task_type === 'GeneralComments'
    )

    return taskId ? this.props.tasks[taskId] : null
  }

  handleSelectTask = (task, room) => {
    this.props.setSelectedTask(task)

    if (room.new_notifications > 0) {
      this.props.updateDealNotifications(this.props.deal, room)
    }
  }

  render() {
    const task = this.getGeneralTaskId()

    if (!task) {
      return false
    }

    const room = this.props.rooms[task.room.id]
      ? this.props.rooms[task.room.id]
      : task.room

    const { new_notifications } = room

    return (
      <Container>
        <ActionButton
          size="small"
          onClick={() => this.handleSelectTask(task, room)}
        >
          <TextMiddleTruncate text={this.props.checklistName} maxLength={15} />
          &nbsp;General Comments
        </ActionButton>

        {(new_notifications > 0 || task.attention_requested) && (
          <BadgeCounter
            isRectangle={new_notifications > 0 && task.attention_requested}
          >
            {task.attention_requested && <PendingIcon />}

            {new_notifications > 0 && (
              <span
                style={{
                  marginLeft: task.attention_requested ? '0.5rem' : 0
                }}
              >
                {new_notifications}
              </span>
            )}
          </BadgeCounter>
        )}
      </Container>
    )
  }
}

function mapStateToProps({ chatroom, deals }) {
  return {
    rooms: chatroom.rooms || {},
    tasks: deals.tasks
  }
}

export default connect(
  mapStateToProps,
  { setSelectedTask, updateDealNotifications }
)(MessageAdmin)