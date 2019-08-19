import React, { MouseEvent } from 'react'

import MiniContactProfile from 'components/MiniContact'
import { plural } from 'components/TemplatesList/helpers'

import styles from './styles'
import { isLastItem } from './helpers'

interface Props {
  event: ICalendarEvent
  onClickAssociation(e: MouseEvent<HTMLElement>): void
}

export function Associations(props: Props) {
  const associations = props.event.full_crm_task!.associations

  const contacts = (associations || []).filter(
    association => association.association_type === 'contact'
  )

  if (contacts.length === 0) {
    return null
  }

  const preposition = getCrmEventTypePreposition(props.event.event_type)
  const visibleContacts = contacts.slice(0, 2)
  const contactsCount = contacts.length
  const contactsOtherCount = contactsCount - 2
  const isPlural = contactsOtherCount > 1
  const needsShowOtherLabel = contactsCount > 2

  return (
    <span>
      {preposition}{' '}
      {visibleContacts.map((contact, index) => (
        <React.Fragment key={`assoc${index}`}>
          <MiniContactProfile
            as="span"
            data={contact.contact as IContact}
            type="event"
          >
            <a
              onClick={e => e.stopPropagation()}
              target="_blank"
              href={`/dashboard/contacts/${contact.contact!.id}`}
            >
              {contact.contact!.display_name}
            </a>
          </MiniContactProfile>
          {!isLastItem(contacts, index) && <span key={`sepr${index}`}>, </span>}
        </React.Fragment>
      ))}
      {needsShowOtherLabel && (
        <>
          {' and '}
          <span style={styles.association} onClick={props.onClickAssociation}>
            {plural(`${contactsCount} other`, isPlural)}
          </span>
        </>
      )}
    </span>
  )
}

function getCrmEventTypePreposition(eventType: string): string {
  switch (eventType) {
    case 'Chat':
    case 'Call':
    case 'In-Person Meeting':
    case 'Other':
      return 'with'

    case 'Mail':
    case 'Email':
    case 'Text':
      return 'to'

    case 'Open House':
      return 'for'

    default:
      return ''
  }
}
