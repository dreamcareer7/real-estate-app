import { differenceInDays } from 'date-fns'

import { ACL } from '@app/constants/acl'
import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'
import { OAuthProvider } from 'constants/contacts'

import { AppcuesUserInfo, AppcuesUserList } from './types'

export const DEFAULT_APPCUES_USER_ACL = Object.values(ACL).reduce(
  (acc, cur) => {
    return {
      ...acc,
      [`has${ACL[cur]}Access`]: false
    }
  },
  {} as AppcuesUserList
)

export function createAppcuesAccessList(
  userACL: IPermission[],
  defaultUserAcl = DEFAULT_APPCUES_USER_ACL
) {
  const appcuesAccessList: AppcuesUserList = {
    ...defaultUserAcl
  }

  userACL.forEach(acl => {
    appcuesAccessList[`has${acl}Access`] = true
  })

  return appcuesAccessList
}

export function createAppcuesUserData(
  gmailOrOutlookSynced: boolean,
  userInfo: AppcuesUserInfo,
  appcuesAccessList: AppcuesUserList
) {
  const { createdAt, ...restInfo } = userInfo

  return {
    ...restInfo,
    accountAgeInDays: differenceInDays(new Date(), createdAt * 1000),
    gmailOrOutlookSynced,
    ...appcuesAccessList
  }
}

export async function prepareAndSendUserData(
  accessList: IPermission[],
  userId: string,
  userInfo: AppcuesUserInfo
) {
  const google = await getOAuthAccounts(OAuthProvider.Google)
  const outlook = await getOAuthAccounts(OAuthProvider.Outlook)
  const gmailOrOutlookSynced = Boolean(google.length || outlook.length)

  const appcuesAccessList = createAppcuesAccessList(accessList)

  const userData = createAppcuesUserData(
    gmailOrOutlookSynced,
    userInfo,
    appcuesAccessList
  )

  // Normally what we should be doing here is to call Appcues.Page(), but
  // behind the scenes, Appcues.identify() also invokes that function.
  // Reac more: https://docs.appcues.com/article/161-javascript-api
  window.AppcuesReady(() => {
    window.Appcues.identify(userId, userData)
  })
}
