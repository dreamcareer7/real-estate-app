declare type IEmailRecipientType =
  | 'Tag'
  | 'List'
  | 'Email'
  | 'Brand'
  | 'AllContacts'

declare interface IEmailRecipientInputBase<T extends IEmailRecipientType> {
  recipient_type: T
}
declare interface IEmailRecipientListInput
  extends IEmailRecipientInputBase<'List'> {
  list: UUID
}
declare interface IEmailRecipientTagInput
  extends IEmailRecipientInputBase<'Tag'> {
  tag: string
}
declare interface IEmailRecipientEmailInput
  extends IEmailRecipientInputBase<'Email'> {
  email: string
  contact?: UUID
}
declare interface IEmailRecipientBrandInput
  extends IEmailRecipientInputBase<'Brand'> {
  brand: UUID
}
declare interface IEmailRecipientAllContactsInput
  extends IEmailRecipientInputBase<'AllContacts'> {}

declare type IEmailRecipientInput =
  | IEmailRecipientEmailInput
  | IEmailRecipientListInput
  | IEmailRecipientTagInput
  | IEmailRecipientAllContactsInput
  | IEmailRecipientBrandInput

declare type IEmailCampaignRecipientAssociation = 'contact' | 'list' | 'brand'

declare type IEmailRecipient<
  Associations extends IEmailCampaignRecipientAssociation = ''
> = {
  campaign: UUID
  created_at: string
  deleted_at: null | string
  eid: UUID
  email: null | string
  id: UUID
  ord: string
  send_type: 'CC' | 'BCC' | 'To'
  recipient_type: IEmailRecipientType
  tag: string
  type: 'email_campaign_recipient'
  updated_at: null | string
} & Association<'contact', IContact, Associations> &
  Association<'list', IContactList, Associations> &
  Association<'brand', IBrand, Associations>

declare interface IEmailCampaignInputBase {
  due_at: Date | null
  from: UUID
  to: IEmailRecipientInput[]
  subject: string
  html: string
  text?: string
  attachments?: UUID[]
  template: UUID
  /**
   * @deprecated, This is not used in practice and is added in initial
   * implementation by the API. It should be removed.
   */
  include_signature?: boolean
}

declare interface IIndividualEmailCampaignInput
  extends IEmailCampaignInputBase {}

declare interface IEmailCampaignInput extends IEmailCampaignInputBase {
  cc?: IEmailRecipientInput[]
  bcc?: IEmailRecipientInput[]
}

declare type IEmailCampaignAssociation =
  | 'emails'
  | 'template'
  | 'from'
  | 'recipients'
  | 'attachments'

declare type IEmailCampaign<
  Associations extends IEmailCampaignAssociation = '',
  RecipientAssociations extends IEmailCampaignRecipientAssociation = ''
> = {
  id: UUID
  created_at: number
  updated_at: null | number
  deleted_at: null | number
  created_by: UUID
  brand: UUID
  subject: string
  include_signature: boolean
  html: string
  due_at: number
  executed_at: null | number
  individual: boolean
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  text: string
  type: 'email_campaign'
  sent: number
} & Association<
  'recipients',
  IEmailRecipient<RecipientAssociations>[],
  Associations
> &
  Association<'from', IUser, Associations> &
  Association<'template', IMarketingTemplateInstance | null, Associations> &
  Association<'emails', any[] | null, Associations> &
  Association<'attachments', IFile[] | null, Associations>

declare interface IEmail {
  domain?: string
  to: string
  from: string
  subject: string
  html: string
  text?: string
  headers?: any
}

/**
 * This is corresponding to {@link IEmailRecipientInput}, but fields like
 * list, tag and contact are objects instead of UUIDs
 */
declare type IDenormalizedEmailRecipientInput =
  | IDenormalizedEmailRecipientEmailInput
  | IDenormalizedEmailRecipientListInput
  | IDenormalizedEmailRecipientTagInput
  | IEmailRecipientAllContactsInput
  | IDenormalizedEmailRecipientBrandInput

declare interface IDenormalizedEmailRecipientEmailInput
  extends Omit<IEmailRecipientEmailInput, 'contact'> {
  contact?: IContact
}

declare interface IDenormalizedEmailRecipientListInput
  extends Omit<IEmailRecipientListInput, 'list'> {
  list: IContactList
}

declare interface IDenormalizedEmailRecipientTagInput
  extends Omit<IEmailRecipientTagInput, 'tag'> {
  tag: IContactTag
}

declare interface IDenormalizedEmailRecipientBrandInput
  extends Omit<IEmailRecipientBrandInput, 'brand'> {
  brand: IBrand
}
