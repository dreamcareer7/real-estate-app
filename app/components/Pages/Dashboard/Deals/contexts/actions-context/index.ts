import { createContext } from 'react'

import { EmailFormValues } from 'components/EmailCompose'

import { initialState } from './reducers'

export type DispatchContext = React.Dispatch<any>

export interface StateContext {
  actions: ActionButtonId[]
  attachments: IDealFile[]
  form?: EmailFormValues
  isDrawerOpen: boolean
}

export const StateContext = createContext<StateContext>(initialState)
export const DispatchContext = createContext<DispatchContext>(() => null)
