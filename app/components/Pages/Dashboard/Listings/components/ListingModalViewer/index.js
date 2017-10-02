import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'

import ListingDesktopView from '../../Listing/components/ListingDesktopView'

const ListingModalViewer = ({ data, show, onHide, listing }) => (
  <div className="c-listing-modal">
    <Modal show={show} onHide={onHide} dialogClassName="c-listing-modal--box">
      <Modal.Body>
        <ListingDesktopView
          data={data}
          onHide={onHide}
          listing={listing}
          container="modal"
        />
      </Modal.Body>
    </Modal>
  </div>
)

export default connect(({ data }) => ({ data }))(ListingModalViewer)
