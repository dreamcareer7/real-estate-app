import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { extractUserInfoFromContact } from '../../../models/contacts'
import { selectContacts } from '../../../reducers/contacts/list'

import BareModal from '../BareModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import AddManuallyButton from './components/AddManuallyButton'
import CancelButton from '../Button/CancelButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  handleAddManually: PropTypes.func.isRequired,
  handleSelectedItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape)
}

const defaultProps = {
  title: 'Select Contact'
}

function SelectContactModal(props) {
  const {
    title,
    isOpen,
    contactsList,
    handleOnClose,
    handleAddManually,
    handleSelectedItem
  } = props

  return (
    <BareModal
      isOpen={isOpen}
      contentLabel={title}
      onRequestClose={handleOnClose}
    >
      <Header title={title}>
        {contactsList.length > 0 && (
          <AddManuallyButton onClick={handleAddManually} />
        )}
      </Header>
      <Body
        list={contactsList}
        handleAddManually={handleAddManually}
        handleSelectedItem={handleSelectedItem}
      />
      <Footer>
        <CancelButton onClick={handleOnClose}>Cancel</CancelButton>
      </Footer>
    </BareModal>
  )
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

function mapStateToProps({ contacts: { list } }) {
  const contactsList = selectContacts(list).map(extractUserInfoFromContact)

  return {
    contactsList
  }
}

export default connect(mapStateToProps)(SelectContactModal)
