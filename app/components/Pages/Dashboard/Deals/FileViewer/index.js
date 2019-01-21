import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory } from 'react-router'

import { getDeal } from 'actions/deals'

import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { isBackOffice } from 'utils/user-teams'

import Spinner from 'components/Spinner'

import { getFileById } from '../utils/files/get-file-by-id'
import { getTaskForm } from '../utils/get-task-form'

import TaskView from '../Dashboard/TaskView'

import { Menu } from './Menu'
import { FactsheetSideMenu } from './FactsheetSideMenu'
import { EnvelopeSideMenu } from './EnvelopeSideMenu'
import { FileDisplay } from './FileDisplay'

import { LayoutContainer, PageContainer } from './styled'

class FileViewer extends React.Component {
  state = {
    deal: this.props.deal,
    isFactsheetOpen: false,
    isCommentsOpen: false
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    if (this.state.deal && this.state.deal.checklists) {
      return false
    }

    try {
      // fetch deal by id
      const deal = await this.props.getDeal(this.props.params.id)

      this.setState({ deal })
    } catch (e) {
      console.log(e)
    }
  }

  toggleShowFactsheet = () =>
    this.setState(state => ({
      isFactsheetOpen: !state.isFactsheetOpen
    }))

  toggleShowComments = () =>
    this.setState(state => ({
      isCommentsOpen: !state.isCommentsOpen
    }))

  getFile() {
    switch (this.EntityType) {
      case 'attachment':
        return this.AttachmentFile

      case 'envelope':
        return this.EnvelopeFile

      default:
        return this.DigitalForm
    }
  }

  getFileType(file) {
    if (file.mime === 'application/pdf') {
      return 'pdf'
    }

    if (file.mime === 'text/html') {
      return 'html'
    }

    if (file.mime.includes('image/')) {
      return 'image'
    }

    return 'unknown'
  }

  get AttachmentFile() {
    const file = getFileById(this.props.params.entityId, {
      deal: this.state.deal,
      tasks: this.props.tasks,
      taskId: this.props.params.taskId
    })

    if (!file) {
      return {}
    }

    return {
      id: file.id,
      type: this.getFileType(file),
      name: file.name,
      url: file.url
    }
  }

  get Envelope() {
    return this.EntityType === 'envelope'
      ? this.props.envelopes[this.props.params.entityId]
      : null
  }

  get EnvelopeFile() {
    const envelope = this.Envelope

    if (!this.props.task || !envelope.documents) {
      return null
    }

    // get document index
    let document = null

    if (this.props.task.submission) {
      document = envelope.documents.find(
        doc => doc.submission === this.props.task.submission.id
      )
    }

    // if couldn't find the file, try to find that in attachments
    if (!document) {
      document = envelope.documents.find(doc =>
        this.props.task.room.attachments.find(file => file.id === doc.file)
      )
    }

    if (!document) {
      return null
    }

    let url

    if (!document.pdf) {
      this.props.notify({
        title: 'File not found',
        status: 'error'
      })
    } else {
      url = document.pdf.url
    }

    return {
      name: envelope.title,
      type: 'pdf',
      url
    }
  }

  get DigitalForm() {
    console.log('>>>>>', this.props.task)

    return getTaskForm(this.state.deal, this.props.task)
  }

  get EntityType() {
    return this.props.params.entityType || 'digital-form'
  }

  handleBackButton = () =>
    browserHistory.push(`/dashboard/deals/${this.state.deal.id}`)

  normalizeName = name => decodeURIComponent(name).replace(/[_-]/g, ' ')

  render() {
    if (!this.state.deal || !this.props.task) {
      return <Spinner />
    }

    const file = this.getFile()
    const isEnvelopeView = this.EntityType === 'envelope'

    return (
      <LayoutContainer>
        <Menu
          title={this.normalizeName(file.name)}
          file={file}
          task={this.props.task}
          deal={this.state.deal}
          showFactsheetButton={!isEnvelopeView}
          isFactsheetOpen={this.state.isFactsheetOpen}
          isCommentsOpen={this.state.isCommentsOpen}
          onToggleFactsheet={this.toggleShowFactsheet}
          onToggleComments={this.toggleShowComments}
          onClickBackButton={this.handleBackButton}
        />

        <PageContainer>
          {!isEnvelopeView && (
            <FactsheetSideMenu
              isFactsheetOpen={this.state.isFactsheetOpen}
              deal={this.state.deal}
              isBackOffice={this.props.isBackOffice}
            />
          )}

          <FileDisplay file={file} />

          {isEnvelopeView && (
            <EnvelopeSideMenu
              deal={this.state.deal}
              file={file}
              envelope={this.Envelope}
            />
          )}
        </PageContainer>

        <TaskView
          deal={this.state.deal}
          task={this.props.task}
          isOpen={this.state.isCommentsOpen}
          isBackOffice={this.props.isBackOffice}
          onClose={this.toggleShowComments}
        />
      </LayoutContainer>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  return {
    deal: selectDealById(deals.list, props.params.id),
    tasks: deals.tasks,
    envelopes: deals.envelopes,
    task: selectTaskById(deals.tasks, props.params.taskId),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  { notify, getDeal }
)(FileViewer)
