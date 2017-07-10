import React from 'react'
import Dropzone from 'react-dropzone'
import Rx from 'rxjs/Rx'
import Message from '../Util/message'
import Model from '../../../../../models/Chatroom'

export default class Upload extends React.Component {

  constructor(props) {
    super(props)
    this.pasteHandler = null
    this.state = {
      dropzoneActive: false
    }
  }

  componentDidMount() {
    const { inputHandler } = this.props
    const { Observable } = Rx

    if (!inputHandler) {
      return false
    }

    // subscribe to paste
    this.pasteHandler = Observable
      .fromEvent(document.getElementById(inputHandler), 'paste')
      .subscribe(e => this.onPasteFile(e))
  }

  componentWillUnmount() {
    if (this.pasteHandler) {
      this.pasteHandler.unsubscribe()
    }
  }

  /**
   * handle paste file from clipboard
   */
  onPasteFile(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items
    const files = []

    for (let index in items) {
      const item = items[index]

      if (item.kind === 'file') {
        const blob = item.getAsFile()
        if (blob) {
          files.push(blob)
        }
      }
    }

    this.onDrop(files)
  }

  /**
   * on drop/upload files into area
   */
  async onDrop(files) {
    const { roomId } = this.props

    this.setState({
      dropzoneActive: false
    })

    if (files.length === 0) {
      return false
    }

    // list of ids of attachments
    const attachments = []

    // create temporary message
    let { qid, message } = this.createTemporaryMessage(files)

    for (let index in files) {
      const file = files[index]

      // update message
      message = this.updateMessage(message, {
        index,
        current: file
      })

      // upload file
      const fileId = await this.uploadFile(file)
      if (fileId) {
        attachments.push(fileId)
      }
    }

    // update message
    this.updateMessage(message, {
      index: ~~message.index + 1,
      current: null
    })

    // post message to server
    this.postMessage(attachments, qid)
  }

  /**
   * upload a file to room
   */
  async uploadFile(file) {
    const { roomId } = this.props

    try {
      const response = await Model.uploadAttachment(roomId, file)
      return response.body.data.id
    } catch(e) {
      return null
    }
  }

  /**
   * update message data
   */
  updateMessage(message, attributes) {
    const { roomId } = this.props

    // update message
    message = {
      ...message,
      ...attributes
    }

    // updaye message
    Message.update(roomId, message)

    return message
  }

  /**
   * create uploading message
   */
  createTemporaryMessage(files) {
    const { roomId, author } = this.props

    const message = {
      comment: '',
      uploading: true,
      index: 0,
      count: files.length,
      current: files[0]
    }

    const { qid, tempMessage } = Message.createTemporaryMessage(roomId, message, author)

    // store message into messages list
    Message.create(roomId, tempMessage)

    return { qid, message: tempMessage }
  }

  /**
   * save message on server
   */
  postMessage(attachments, qid) {
    const { roomId, author } = this.props

    const message = {
      attachments,
      author: author.id,
      room: roomId
    }

    Message.postMessage(roomId, message, qid)
  }

  render() {
    const { children, disableClick } = this.props
    const { dropzoneActive } = this.state

    return (
      <div className="upload">
        <Dropzone
          ref={(node) => { this.dropzone = node }}
          onDrop={files => this.onDrop(files)}
          onDragEnter={() => this.setState({ dropzoneActive: true })}
          onDragLeave={() => this.setState({ dropzoneActive: false })}
          multiple={true}
          accept="application/pdf,image/*"
          disableClick={disableClick || false}
          style={this.props.dropZoneStyle}
        >
          {
            dropzoneActive &&
            <div
              className="upload-guide"
            >
              <div className="upload-area">
                <i className="fa fa-long-arrow-down fa-3x" />
                <p>Upload Here</p>
              </div>
            </div>
          }

          {
            children ? children : <i className="fa fa-plus" aria-hidden="true" />
          }
        </Dropzone>
      </div>
    )
  }
}
