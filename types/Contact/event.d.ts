interface TaskAssociations {
  id: string
  association_type: 'contact' | 'deal' | 'listing'
  brand: string
  contact?: IContact
  deal?: IDeal
  listing?: any
  created_at: string
  created_by: string
  crm_task: string
  deleted_at: string | null
  index: number | null
  metadata: any
  type: string
  updated_at: number
}

declare interface IEvent extends IModel {
  associations: TaskAssociations
  due_date: number
  task_type: string
  contact: IContact
  title: string
  description: string
}
