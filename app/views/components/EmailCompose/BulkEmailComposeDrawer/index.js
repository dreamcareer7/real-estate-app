import React from 'react'

import { Field } from 'react-final-form'
import styled from 'styled-components'

import Tooltip from 'components/tooltip'
import { MultipleContactsSelect } from 'components/Forms/MultipleContactsSelect'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'
import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import { sendBulkEmail } from 'models/email-compose/send-bulk-email'
import IconLock from 'components/SvgIcons/Lock/IconLock'

const LockIcon = styled(IconLock)`
  vertical-align: text-bottom;
  margin: 0 0.5rem;
`

export function BulkEmailComposeDrawer({
  getEmail,
  disableAddNewRecipient = false,
  ...otherProps
}) {
  const sendEmail = formValue =>
    sendBulkEmail(
      getEmail({
        from: formValue.fromId,
        to: formValue.recipients,
        subject: (formValue.subject || '').trim(),
        html: formValue.body,
        attachments: Object.values(formValue.attachments).map(
          item => item.file_id
        ),
        due_at: formValue.due_at
      })
    )

  return (
    <EmailComposeDrawer
      {...otherProps}
      sendEmail={sendEmail}
      getSendEmailResultMessages={form =>
        getSendEmailResultMessages(form.recipients.length, form.due_at)
      }
    >
      <Field
        placeholder={
          <>
            Recipients
            <Tooltip caption="Emails will be sent individually">
              <LockIcon />
            </Tooltip>
          </>
        }
        name="recipients"
        disableAddNewRecipient={disableAddNewRecipient}
        component={MultipleContactsSelect}
      />
    </EmailComposeDrawer>
  )
}
