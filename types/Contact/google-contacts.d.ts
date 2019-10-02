declare interface IOAuthAccountImport {
  redirect: string
  url: string
  type: string
}

declare interface IOAuthAccount {
  brand: UUID
  contacts_last_sync_at: string
  created_at: string
  deleted_at: null | string
  display_name: string
  email: string
  first_name: string
  gid: UUID
  history_id: null | string
  id: string
  last_name: string
  last_sync_at: string
  last_sync_duration: number
  messages_total: null | number
  ord: string
  photo: string
  resource_name: string
  revoked: boolean
  histories?: IGoogleSyncHistory[]
  sync_status: 'success' | 'pending' | null
  scope: string[]
  threads_total: null | number
  type: string
  updated_at: string
  user: UUID
}

declare interface IGoogleAccount extends IOAuthAccount {}
declare interface IMicrosoftAccount extends IOAuthAccount {}

declare type IGoogleScope =
  | 'contacts.readonly'
  | 'gmail.readonly'
  | 'gmail.send'

declare interface IGoogleSyncHistory {
  brand: string
  contacts_total: number
  created_at: string
  deleted_at: null | string
  glsh: UUID
  google_credential: UUID
  id: UUID
  messages_total: number
  ord: string
  status: boolean
  sync_duration: number
  synced_contacts_num: number
  synced_messages_num: number
  synced_threads_num: number
  threads_total: number
  extract_contacts_error: null | string
  type: 'google_sync_history'
  updated_at: string
  user: UUID
}
