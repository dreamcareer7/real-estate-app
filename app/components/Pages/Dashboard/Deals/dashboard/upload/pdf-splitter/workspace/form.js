import React from 'react'
import { connect } from 'react-redux'
import { Button, ProgressBar } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TasksDropDown from '../../tasks-dropdown'
import Checkbox from '../../../../components/radio'
import Deal from '../../../../../../../../models/Deal'
import {
  resetSplitterSelectedPages,
  resetSplitter,
  changeNeedsAttention,
  setUploadAttributes
} from '../../../../../../../../store_actions/deals'

class WorkspaceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      title: '',
      task: props.upload.task || null,
      notifyOffice: false
    }
  }

  isFormValidated() {
    const { title, task } = this.state
    const { splitter } = this.props

    if (title.length > 0 && task !== null && _.size(splitter.pages) > 0) {
      return true
    }

    return false
  }

  async save() {
    const { title, task, notifyOffice } = this.state
    const { notify, upload, splitter } = this.props
    const { pages } = splitter
    let created = false

    // set status
    this.setState({ saving: true })

    const files = _.chain(pages)
      .pluck('documentId')
      .uniq()
      .map(id => {
        const file = upload.files[id].fileObject
        file.id = id
        return file
      })
      .value()

    try {
      created = await Deal.splitPDF(title, task.room.id, files, pages)

      // flag splitted files as uploaded items
      files.forEach(file => {
        this.props.setUploadAttributes(file.id, { status: 'uploaded' })
      })

      if (notifyOffice) {
        this.props.changeNeedsAttention(task.id, true)
      }

      notify({
        message: `Pdf "${title}" created successfully`,
        status: 'success'
      })

    } catch(e) {
      notify({
        message: "Couldn't create pdf file. try again.",
        status: 'error'
      })
    }

    // set status
    this.setState({ saving: false })

    return created
  }

  async saveAndQuit() {
    const saved = await this.save()

    if (!saved) {
      return false
    }

    // destruct splitter states
    this.props.resetSplitter()
  }

  async saveAndNew() {
    const saved = await this.save()

    if (!saved) {
      return false
    }

    // reset selected pages
    this.props.resetSplitterSelectedPages()
  }

  render() {
    const { upload, tasks } = this.props
    const { title, task, notifyOffice, saving } = this.state
    const formValidated = this.isFormValidated()

    return (
      <div className="details">
        <input
          className="title"
          placeholder="Document title ..."
          value={title}
          onChange={e => this.setState({ title: e.target.value })}
        />

        <TasksDropDown
          onSelectTask={(taskId) => this.setState({ task: tasks[taskId] })}
          selectedTask={task}
          upload={upload}
        />

        <Checkbox
          square
          selected={notifyOffice}
          title="Notify Office"
          onClick={() => this.setState({ notifyOffice: !notifyOffice })}
        />

        <div className="buttons">
          {
            !saving ?
            <div>
              <button
                onClick={() => this.saveAndQuit()}
                disabled={!formValidated}
                className={cn('save-quit', { disabled: !formValidated })}
              >
                Save and quit
              </button>

              <button
                className={cn('save-new', { disabled: !formValidated })}
                disabled={!formValidated}
                onClick={() => this.saveAndNew()}
              >
                Save and create another
              </button>
            </div> :
            <div className="prg">
              Saving PDF...
              <ProgressBar now={100} bsStyle="success" active />
            </div>
          }
        </div>

      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    upload: deals.upload,
    splitter: deals.splitter,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps, {
  notify,
  resetSplitter,
  resetSplitterSelectedPages,
  setUploadAttributes,
  changeNeedsAttention
})(WorkspaceForm)
