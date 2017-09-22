import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { addNotification as notify } from 'reapop'
import { Row, Col } from 'react-bootstrap'
import Message from '../../../Chatroom/Util/message'
import Deal from '../../../../../../models/Deal'
import { changeTaskStatus, changeNeedsAttention } from '../../../../../../store_actions/deals'
import ActionButtons from './cta'

class CommentCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSaving: false,
      comment: '',
      rows: 2,
      height: 40,
    }
  }

  onHeightChangeHandler(height) {
    this.setState({ height: height + 5 })
  }

  onCommentSaved() {
    // scroll to the end
    const el = document.getElementById('deals-task-scrollable')
    el.scrollTop = el.scrollHeight
  }

  /**
   * post comment,
   * also change needs_attention flag and change status of task if requests by BO
   */
  async sendComment(needs_attention = null, task_status = null) {
    const { task, user, changeTaskStatus, changeNeedsAttention, notify } = this.props
    const { comment } = this.state

    if (comment) {
      const message = {
        comment,
        author: user.id,
        room: task.room.id
      }

      // send message
      Message.postTaskComment(task, message)
      .then(() => this.onCommentSaved())
    }

    // clear message box
    this.setState({
      comment: '',
      rows: 1,
      isSaving: true
    })

    try {
      if (needs_attention !== null) {
        await changeNeedsAttention(task.id, needs_attention)
      }

      if (task_status !== null) {
        await changeTaskStatus(task.id, task_status)
        notify({
          message: `Task status has changed to ${task_status}`,
          status: 'success',
          dismissible: true
        })
      }

    } catch(e) {
      notify({
        message: 'Can not complete this action. try again',
        status: 'error',
        dismissible: true
      })
    }

    this.setState({
      isSaving: false
    })
  }

  render() {
    const { comment, rows, height, isSaving } = this.state
    const { task, noCloseButton, onCloseTask } = this.props

    return (
      <div className="deal-comment-create">
        <Textarea
          autoFocus
          dir="auto"
          placeholder="Write a comment ..."
          rows={rows}
          maxRows={3}
          style={{ width: '100%', height: `${height}px`}}
          value={comment}
          onChange={e => this.setState({ comment: e.target.value })}
          onHeightChange={height => this.onHeightChangeHandler(height)}
        />

        <Row>
          <Col md={1} sm={1}>
            {
              noCloseButton !== true &&
              <button
                className="deal-button close-task"
                onClick={() => onCloseTask()}
              >
                <i className="fa fa-2x fa-angle-right" />
              </button>
            }
          </Col>

          <Col
            md={noCloseButton ? 12 : 11}
            sm={noCloseButton ? 12 : 11}
            style={{ textAlign: 'right'}}
          >
            <ActionButtons
              hasComment={comment.length > 0}
              isSaving={isSaving}
              task={task}
              onSendComment={(notify, status) => this.sendComment(notify, status)}
            />
          </Col>
        </Row>

      </div>
    )
  }
}

export default connect(({ deals, data }) => ({
  user: data.user
}), { changeTaskStatus, changeNeedsAttention, notify })(CommentCreate)
