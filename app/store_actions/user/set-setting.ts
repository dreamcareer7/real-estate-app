import { getActiveTeamId } from '@app/utils/user-teams'

import { SET_USER_SETTING } from '../../constants/user'
import { getTeams } from '../../models/user/get-teams'
import { putUserSetting } from '../../models/user/put-user-setting'

/**
 * Put a key value data as user settings data under
 * the specific brand and update user object
 * @param {string} key The setting key
 * @param {any} value The setting value
 * @param {UUID} [brand] The active brand id
 */

export function setUserSetting(key: string, value: any, brand?: UUID) {
  return async (dispatch, getState) => {
    const user = getState().user

    try {
      const res = await putUserSetting(key, value, brand)

      if (Array.isArray(res.body) && res.body[0]) {
        const brandId = `${user.id}_${getActiveTeamId(user)}`

        let payload: IUser = user

        if (user.teams) {
          payload = {
            ...user,
            teams: user.teams.map(team => {
              if (brandId === team.id) {
                const currentSettings = team.settings || {}

                return {
                  ...team,
                  settings: {
                    ...currentSettings,
                    [key]: value
                  }
                }
              }

              return team
            })
          }
        } else {
          const teams: IUserTeam[] = await getTeams(user)

          payload = {
            ...user,
            teams
          }
        }

        return dispatch({
          type: SET_USER_SETTING,
          user: payload
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
