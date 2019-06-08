import * as React from 'react'

import { TextWithHighlights } from 'components/TextWithHighlights'

import UserIcon from 'components/SvgIcons/InPerson/IconInPerson'

import IconButton from 'components/Button/IconButton'
import Tooltip from 'components/tooltip'
import AddCircleOutlineIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { userMatches } from '../../helpers/users-matches'
import { TeamLink, TeamLinkWrapper, TeamUserBadge } from './styled'
import { getBrandUsers } from 'utils/user-teams'

interface Props {
  team: IBrand
  searchTerm: string
  onAddChild: (team: IBrand) => void
}

export function TeamName({ team, searchTerm, onAddChild }: Props) {
  const numUsers = searchTerm
    ? getBrandUsers(team).filter(user => userMatches(user, searchTerm)).length
    : 0

  return (
    <TeamLinkWrapper alignCenter>
      <TeamLink
        noStyle
        // replace /* doesn't seem to work (v4 only?) */
        activeClassName="active"
        style={{ flex: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}
        to={`/dashboard/teams/${team.id}`}
      >
        {searchTerm ? (
          <>
            <TextWithHighlights>{team.name}</TextWithHighlights>
            {numUsers > 0 && (
              <TeamUserBadge appearance="black">
                <UserIcon />
                {numUsers}
              </TeamUserBadge>
            )}
          </>
        ) : (
          team.name
        )}
      </TeamLink>
      <Tooltip caption="Add New Team" placement="bottom">
        <IconButton
          inverse
          iconSize="large"
          onClick={() => onAddChild(team)}
          isFit
          style={{ margin: '0.3rem' }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    </TeamLinkWrapper>
  )
}