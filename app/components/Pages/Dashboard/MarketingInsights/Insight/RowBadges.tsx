import React from 'react'

import { StyledBadge } from './styled'
import { ContactsListType } from './types'

interface BadgePropsType {
  data: ContactsListType
}

function RowBadges({ data }: BadgePropsType) {
  const output: React.Node[] = []

  if (data.unsubscribed > 0) {
    const count = data.unsubscribed >= 2 ? `(${data.unsubscribed})` : null

    output.push(
      <StyledBadge appearance="warning">Unsubscribed {count}</StyledBadge>
    )
  }

  if (data.failed > 0) {
    const count = data.failed >= 2 ? `(${data.failed})` : null

    output.push(<StyledBadge>Bounced {count}</StyledBadge>)
  }

  return <React.Fragment>{output}</React.Fragment>
}

export default RowBadges