import React, { Fragment } from 'react'
import TagsOverlay from '../../components/TagsOverlay'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

export default class TagContacts extends React.Component {
  state = {
    overlayIsOpen: false
  }

  openOverLay = () => this.setState({ overlayIsOpen: true })
  closeOverlay = () => this.setState({ overlayIsOpen: false })

  render() {
    const { selectedRows } = this.props
    const { overlayIsOpen } = this.state

    return (
      <Fragment>
        <ActionButton
          inverse
          onClick={this.openOverLay}
          style={{ padding: '0.70em 1.5em' }}
        >
          Tag
        </ActionButton>

        <TagsOverlay
          selectedContactsIds={selectedRows}
          isOpen={overlayIsOpen}
          closeOverlay={this.closeOverlay}
          resetSelectedRows={this.props.resetSelectedRows}
        />
      </Fragment>
    )
  }
}