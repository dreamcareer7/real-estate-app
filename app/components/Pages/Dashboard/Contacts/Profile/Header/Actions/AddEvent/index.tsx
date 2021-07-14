import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import { connect } from 'react-redux'

import { EventDrawer } from 'components/EventDrawer'
import { normalizeContact } from 'views/utils/association-normalizers'

interface StateProps {
  user: IUser
}

interface Props {
  contact: IContact
}

function AddEvent({ contact, user }: Props & StateProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={toggleDrawer}
        data-tour-id="add-event-button"
      >
        Add Event
      </Button>

      <EventDrawer
        isOpen={isDrawerOpen}
        defaultAssociation={{
          association_type: 'contact',
          contact: normalizeContact(contact)
        }}
        user={user}
        submitCallback={toggleDrawer}
        onClose={toggleDrawer}
      />
    </>
  )
}

function mapStateToProps({ user }: StateProps) {
  return { user }
}

export default connect(mapStateToProps)(AddEvent)
