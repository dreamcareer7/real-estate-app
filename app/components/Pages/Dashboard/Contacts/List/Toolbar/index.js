import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import ExportContacts from './ExportContactsButton'
import TagContacts from './TagContacts'
import ShareListing from './ShareListing'

Toolbar.propTypes = {
  disabled: PropTypes.bool,
  selectedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalCount: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired
}

Toolbar.defaultProps = {
  disabled: false
}

export function Toolbar(props) {
  const selectedRowsLength = props.selectedRows.length

  return (
    <Flex full alignCenter>
      <span style={{ fontSize: '1.7rem', marginRight: '1em' }}>
        {selectedRowsLength > 0 && `${selectedRowsLength} of `}
        {`${props.totalCount.toLocaleString()} Contacts`}
      </span>

      <TagContacts selectedRows={props.selectedRows} />
      <ExportContacts
        disabled={props.disabled}
        filters={props.filters}
        exportIds={props.selectedRows}
      />
      {selectedRowsLength > 0 && (
        <div className="list--secondary-button">
          <button
            disabled={props.deleting}
            className="button c-button--shadow"
            onClick={event => props.onDelete(event, props.selectedRows)}
          >
            Delete
          </button>
        </div>
      )}

      {selectedRowsLength > 0 && <ShareListing />}
    </Flex>
  )
}
