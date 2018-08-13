import React from 'react'
import { browserHistory } from 'react-router'

import Import from '../Import'
import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'

export function Header({ user, title, isSideMenuOpen, onMenuTriggerChange }) {
  return (
    <PageHeader isFlat style={{ marginBottom: '32px' }}>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger
          tooltip={isSideMenuOpen ? 'Collapse Menu' : 'Expand Menu'}
          onClick={onMenuTriggerChange}
        />
        <PageHeader.Heading>{title}</PageHeader.Heading>
      </PageHeader.Title>

      <PageHeader.Menu>
        <Import userId={user.id} />
        <ActionButton
          onClick={() => browserHistory.push('/dashboard/contacts/new')}
        >
          New Contact
        </ActionButton>
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
