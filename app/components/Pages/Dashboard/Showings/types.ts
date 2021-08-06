import type { ReactNode } from 'react'

export type ShowingDetailTabType = 'Bookings' | 'Visitors' | 'Settings'

export type ShowingsTabType = 'Properties' | 'Bookings'

export type GooglePlace = google.maps.GeocoderResult

export interface ShowingPropertyBase<T extends string> {
  type: T
}

export interface ShowingPropertyPlace extends ShowingPropertyBase<'place'> {
  address: IStdAddr
  gallery: IMediaGallery
}

export interface ShowingPropertyListing extends ShowingPropertyBase<'listing'> {
  listing: ICompactListing
}

export interface ShowingPropertyDeal extends ShowingPropertyBase<'deal'> {
  deal: IDeal
}

export type ShowingPropertyType =
  | ShowingPropertyDeal
  | ShowingPropertyListing
  | ShowingPropertyPlace

export type AppointmentFilter = 'All' | IShowingAppointmentStatus | 'Feedback'

export interface AppointmentFilterInfo {
  label: string
  icon?: ReactNode
  filter?: (
    appointments: IShowingAppointment<'showing'>[]
  ) => IShowingAppointment<'showing'>[]
}

export interface DismissActionParams {
  appointmentId: UUID
  showingId: UUID
  notificationCount: number
}

export interface ApprovalActionParams extends DismissActionParams {
  appointment: IShowingAppointment
}

export interface AckActionParams {
  appointmentId: UUID
  showingId: UUID
  notificationIds: UUID[]
}

export type CreateShowingErrors = Record<string, string>

export interface ShowingAvailabilityItem extends IShowingAvailabilityInput {
  id: UUID
}

export type ShowingRoleInputMode = 'form' | 'card'

export interface ShowingRoleInput extends IShowingRoleInput {
  id: UUID
  mode: ShowingRoleInputMode
  deletable: boolean
}

export type ShowingRoleInputPerson = Pick<
  IShowingRoleInput,
  'user' | 'brand' | 'first_name' | 'last_name' | 'email' | 'phone_number'
>