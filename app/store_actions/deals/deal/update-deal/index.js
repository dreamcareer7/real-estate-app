import { normalize } from 'normalizr'
import { batch } from 'react-redux'

import { setTasks } from '../../task'
import { setChecklists } from '../../checklist/set-checklist'
import { setRoles } from '../../role'
import { setEnvelopes } from '../../envelope'

import * as actionTypes from '../../../../constants/deals'
import * as schema from '../../schema'

export function updateDeal(deal) {
  return async dispatch => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, roles, envelopes, checklists, tasks } = entities

    batch(() => {
      dispatch(setTasks(tasks))
      dispatch(setChecklists(checklists))
      dispatch(setRoles(roles))
      dispatch(setEnvelopes(envelopes))
      dispatch({
        type: actionTypes.UPDATE_DEAL,
        deal: deals[deal.id]
      })
    })

    return deals[deal.id]
  }
}
