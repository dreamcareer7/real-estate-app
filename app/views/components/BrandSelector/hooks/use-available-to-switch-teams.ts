/*
  I'm creating this hook just because of some kinda hokm hokumati ):
  It's almost a copy of ./useTeams but in order to avoid messing up with the original hook create this one
*/
import { useMemo, useCallback } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import useAsync from '@app/hooks/use-async'
import { getAvailableBrandsToSwitch } from '@app/models/BrandConsole/Brands'
import { getTeams } from '@app/models/user/get-teams'
import { TreeFn } from 'utils/tree-utils/types'

import { getExpandBrandsByType } from '../helpers/get-expand-brands-by-types'

import { useFilterTeams, UseFilterTeamsReturnType } from './use-filter-teams'

interface UseAvailableToSwitchTeamsReturnType
  extends Omit<UseFilterTeamsReturnType, 'filterTeams'> {
  isError: boolean
  isLoading: boolean
  userTeams: TreeFn<IBrand>
  allTeams: TreeFn<IBrand>
  allTeamInitialExpandedNodes: UUID[]
}

type Teams = {
  userTeams: IBrand[]
  allTeams: IBrand[]
}

export function useAvailableToSwitchTeams(): UseAvailableToSwitchTeamsReturnType {
  const {
    data: teams,
    isLoading,
    isError,
    run
  } = useAsync<Teams>({
    data: {
      userTeams: [],
      allTeams: []
    }
  })
  const { searchTerm, handleSearch, filterTeams }: UseFilterTeamsReturnType =
    useFilterTeams()

  useEffectOnce(() => {
    run(async () => {
      const teams = await getAvailableBrandsToSwitch()
      const userRoles = await getTeams()
      const userTeams = userRoles.map(team => team.brand)

      return {
        userTeams,
        allTeams: teams
      }
    })
  })

  const allTeamInitialExpandedNodes = useMemo(() => {
    if (!teams.allTeams) {
      return []
    }

    if (searchTerm) {
      // expand all type on brand type
      return getExpandBrandsByType(teams.allTeams, [
        'Team',
        'Other',
        'Region',
        'Office',
        'Brokerage',
        'Personal'
      ])
    }

    return getExpandBrandsByType(teams.allTeams)
  }, [searchTerm, teams.allTeams])

  const getChildNodesForAllTeams = useCallback(
    parent => (parent ? parent.children || [] : teams.allTeams || []),
    [teams.allTeams]
  )
  const getChildNodesForUserTeams = useCallback(
    parent => (parent ? parent.children || [] : teams.userTeams || []),
    [teams.userTeams]
  )

  return {
    isError,
    isLoading,
    searchTerm,
    handleSearch,
    allTeamInitialExpandedNodes,
    allTeams: filterTeams(getChildNodesForAllTeams),
    userTeams: filterTeams(getChildNodesForUserTeams)
  }
}
