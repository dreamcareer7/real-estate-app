import React, { Component } from 'react'
import Alert from '../../../../Partials/Alert'
import { Modal, Button } from 'react-bootstrap'

class NewTaskModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: ''
    }

    this.handleCreateTask = this.handleCreateTask.bind(this)
    this.handleCreateTaskAndUploadFile = this.handleCreateTaskAndUploadFile.bind(
      this
    )
  }

  setTitle(title) {
    this.setState({
      title
    })
  }

  handleCreateTask() {
    this.props.handleCreateTask(this.state.title)
    this.setTitle('')
  }

  handleCreateTaskAndUploadFile() {
    this.props.handleCreateTaskAndUploadFile(this.state.title)
    this.setTitle('')
  }

  render() {
    const { show, onClose, isCreatingTask, isFailed } = this.props

    const { title } = this.state
    const canCreateTask = title && title.length > 0 && !isCreatingTask

    return (
      <Modal
        dialogClassName="c-new-task-modal"
        show={show}
        onHide={onClose}
        backdrop="static"
      >
        <Modal.Header closeButton>Create New Task</Modal.Header>

        <Modal.Body>
          <span className="label">Title</span>
          <input
            type="text"
            readOnly={isCreatingTask}
            value={title}
            onChange={e => this.setTitle(e.target.value)}
          />

          <span className="note">
            Accurate titles help with context when glancing through your
            checklist.
          </span>
        </Modal.Body>

        <Modal.Footer>
          {isFailed && (
            <Alert
              code={500}
              type="error"
              style={{
                textAlign: 'left',
                margin: '0 0 1rem'
              }}
              supportHandler={onClose}
            />
          )}

          {!isCreatingTask && (
            <Button
              className="c-new-task-modal__submit-btn inverse"
              disabled={!canCreateTask}
              onClick={this.handleCreateTask}
            >
              Create Task
            </Button>
          )}

          <Button
            bsStyle="primary"
            className="c-new-task-modal__submit-btn"
            disabled={!canCreateTask}
            onClick={this.handleCreateTaskAndUploadFile}
          >
            {isCreatingTask ? 'Creating Task ...' : 'Create & Upload'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default NewTaskModal
