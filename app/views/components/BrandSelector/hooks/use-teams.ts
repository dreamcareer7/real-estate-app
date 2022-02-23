import { useMemo, useCallback } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import useAsync from '@app/hooks/use-async'
import { getAvailableBrandsToSwitch } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'

import { getBrandsWithMembers } from '../helpers/get-brands-with-members'
import { getExpandBrandsByType } from '../helpers/get-expand-brands-by-types'

interface UseTeamsReturnType {
  isError: boolean
  isLoading: boolean
  teams: TreeFn<IBrand>
  initialExpandedNodes: UUID[]
}

export function useTeams(): UseTeamsReturnType {
  const { data: teams, isLoading, isError, run } = useAsync<IBrand[]>()

  useEffectOnce(() => {
    run(async () => {
      const teams = await getAvailableBrandsToSwitch()

      return teams
    })
  })

  const filteredTeams = useMemo(() => getBrandsWithMembers(teams), [teams])
  const initialExpandedNodes = useMemo(() => {
    if (!filteredTeams) {
      return []
    }

    return getExpandBrandsByType(filteredTeams)
  }, [filteredTeams])

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : filteredTeams || []),
    [filteredTeams]
  )

  return {
    isError,
    isLoading,
    teams: getChildNodes,
    initialExpandedNodes
  }
}
