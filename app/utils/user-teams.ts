import cookie from 'js-cookie'
import idx from 'idx'
import { notDeleted } from './not-deleted'
import { flatMap, identity, uniqBy } from 'lodash'

function getActiveTeamFromCookieOrUser(user) {
  return user.active_brand || user.brand || cookie.get('rechat-active-team')
}

export function getActiveTeam(user: Partial<IUser> = {}): IUserTeam | null {
  const { teams } = user

  if (!teams) {
    return null
  }

  let activeTeam = teams.find(
    team => team.brand.id === getActiveTeamFromCookieOrUser(user)
  )

  if (!activeTeam && teams) {
    activeTeam = teams[0]
  }

  return activeTeam || null
}

export function getActiveTeamId(user: IUser): string | null {
  if (user.active_brand) {
    return user.active_brand
  }

  const activeTeam = getActiveTeam(user)

  if (!activeTeam) {
    return user.brand
  }

  return activeTeam.brand.id
}

export function getActiveTeamACL(user: IUser): string[] {
  const team = getActiveTeam(user)

  return team && team.acl ? team.acl : []
}

export function isSoloActiveTeam(user): boolean {
  const team = getActiveTeam(user)

  return !!(team && team.brand && team.brand.member_count === 1)
}

export function hasUserAccess(user: IUser, access: string) {
  return getActiveTeamACL(user).includes(access)
}

export function hasUserAccessToDeals(user): boolean {
  return hasUserAccess(user, 'Deals') || isBackOffice(user)
}

export function hasUserAccessToCrm(user): boolean {
  return hasUserAccess(user, 'CRM')
}

export function isBackOffice(user): boolean {
  return hasUserAccess(user, 'BackOffice')
}

export function viewAs(user, activeTeam = getActiveTeam(user)) {
  if (
    activeTeam &&
    !idx(activeTeam, t => t.acl.includes('BackOffice')) &&
    idx(activeTeam, team => team.settings.user_filter[0])
  ) {
    return activeTeam.settings.user_filter
  }

  return []
}

export function getActiveTeamSettings(user: IUser, key: string | null = null) {
  const team = getActiveTeam(user)
  const settings = (team && team.settings) || {}
  return key ? settings[key] : settings
}

export function viewAsEveryoneOnTeam(user: IUser): boolean {
  const users = viewAs(user)
  return (
    users.length === 0 ||
    getTeamAvailableMembers(getActiveTeam(user)).length === users.length
  )
}

export function getTeamAvailableMembers(team: IUserTeam | null) {
  return team && team.brand ? getBrandUsers(team.brand) : []
}

export function getRoleUsers(role: IBrandRole, includeDeletedUsers = false) {
  return (role.users || [])
    .filter(includeDeletedUsers ? identity : notDeleted)
    .map(roleUser => roleUser.user)
}

export function getBrandUsers(
  team: IBrand,
  includeDeletedUsers = false
): IUser[] {
  return uniqBy(
    flatMap(
      (team.roles || [])
        .filter(notDeleted)
        .map(role => getRoleUsers(role, includeDeletedUsers))
    ),
    'id'
  )
}

export function getUserRoles(team: IBrand, userId: string) {
  return (team.roles || []).filter(
    role =>
      notDeleted(role) &&
      (role.users || []).find(
        roleUser => notDeleted(roleUser) && roleUser.user.id === userId
      )
  )
}