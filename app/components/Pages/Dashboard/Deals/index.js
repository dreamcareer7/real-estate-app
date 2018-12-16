import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {
  getDeals,
  searchDeals,
  getContexts,
  getForms
} from '../../../../store_actions/deals'
import {
  hasUserAccess,
  viewAsEveryoneOnTeam
} from '../../../../utils/user-teams'

class DealsContainer extends React.Component {
  componentDidMount() {
    const { props } = this
    const { dispatch, user } = props
    const isBackOffice = hasUserAccess(user, 'BackOffice')

    if (!hasUserAccess(user, 'Deals') && !isBackOffice) {
      browserHistory.push('/dashboard/mls')
    }

    if (!props.deals && !props.isFetchingDeals) {
      if (isBackOffice || viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user))
      }
    }

    if (!props.contexts) {
      dispatch(getContexts())
    }

    if (!props.forms) {
      dispatch(getForms())
    }
  }

  render() {
    return <div className="deals">{this.props.children}</div>
  }
}

export default connect(({ deals, user }) => ({
  error: deals.properties.error,
  deals: deals.list,
  contexts: deals.contexts,
  forms: deals.forms,
  isFetchingDeals: deals.properties.isFetchingDeals,
  user
}))(DealsContainer)
