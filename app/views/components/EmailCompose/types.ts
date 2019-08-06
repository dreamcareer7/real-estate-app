import { ReactNode } from 'react'

import { Recipient } from '../ContactsChipsInput/types'

export interface EmailFormValues {
  attachments: any
  recipients: Recipient[] | undefined
  subject: string
  from: string
  due_at: string
  body: string | undefined
  fromId: any
}

export interface EmailComposeDrawerProps {
  from: {
    id: string
    display_name: string
    email: string
  }
  sendEmail: (values: EmailFormValues) => Promise<any>
  isOpen: boolean
  getSendEmailResultMessages: (
    values: EmailFormValues
  ) => { successMessage: string; errorMessage: string }
  onSent: () => void
  onClose: () => void
  deal?: IDeal
  body?: string
  recipients?: any[] // FIXME: replace any with proper type
  defaultAttachments?: any[] // FIXME: replace any with proper type
  isSubmitDisabled?: boolean
  hasStaticBody?: boolean
  hasDealsAttachments?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean

  dispatch: any // Extending DispatchProps seems to have problems
  signature: string
  children: ReactNode
}
