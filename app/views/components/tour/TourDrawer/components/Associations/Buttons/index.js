import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import Button from '../../../../../Button/TextIconButton'
import IconContact from '../../../../../SvgIcons/Contacts/IconContacts'
// import IconListing from '../../../../../SvgIcons/Properties/IconProperties'
import { AddContactAssociation } from '../../../../../AddContactAssociations'
// import { AddListingAssociation } from '../../../../../AddListingAssociations'

const Container = Flex.extend`
  margin-bottom: 1.5em;

  > div > button {
    margin-right: 1em;
  }
`

const propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  handleSelect: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}

export class AssociationsButtons extends React.Component {
  renderButton = (onClick, Icon, text) => (
    <Button
      text={text}
      type="button"
      iconLeft={Icon}
      onClick={onClick}
      appearance="outline"
      disabled={this.props.disabled}
    />
  )

  render() {
    const { disabled } = this.props

    return (
      <Container inline>
        <AddContactAssociation
          title="Add Client"
          disabled={disabled}
          handleAdd={this.props.handleSelect}
          buttonRenderer={onClick =>
            this.renderButton(onClick, IconContact, 'Add Client')
          }
        />
      </Container>
    )
  }
}

AssociationsButtons.propTypes = propTypes
