import { ReactNode } from 'react'

// TODO: we can remove this and directly work with file objects.
interface EmailComposeAttachment {
  title: string
  date: Date
  url: string
}

export interface EmailFormValues {
  attachments: EmailComposeAttachment[]
  to: IDenormalizedEmailRecipientInput[] | undefined
  cc?: IDenormalizedEmailRecipientInput[] | undefined
  bcc?: IDenormalizedEmailRecipientInput[] | undefined
  subject: string
  from: IUser
  due_at: Date | null
  body: string | undefined
}

export interface EmailComposeDrawerProps {
  initialValues?: Partial<EmailFormValues>
  sendEmail: (values: EmailFormValues) => Promise<IEmailCampaign>
  isOpen: boolean
  getSendEmailResultMessages: (
    values: EmailFormValues
  ) => { successMessage: string; errorMessage: string }
  onSent?: (result: IEmailCampaign) => void
  onClose?: () => void
  title?: string
  /**
   * A deal to suggest attachments from it
   */
  deal?: IDeal
  isSubmitDisabled?: boolean
  hasStaticBody?: boolean
  hasDealsAttachments?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean

  renderCollapsedFields: (values: EmailFormValues) => ReactNode
  renderFields: (values: EmailFormValues) => ReactNode

  dispatch: any // Extending DispatchProps seems to have problems
}
