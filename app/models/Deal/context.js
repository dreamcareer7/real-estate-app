import Fetch from '../../services/fetch'
import context from '../../constants/deals/context'

/**
 * get contexts info
 */
export async function getContexts(user = {}) {
  const { access_token } = user

  try {
    const request = new Fetch().get('/deals/contexts')

    // required on ssr
    if (access_token) {
      request.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await request

    return response.body.data
  } catch (e) {
    return null
  }
}

/**
 * update deal context
 */
export async function updateContext(dealId, context) {
  try {
    const response = await new Fetch().post(`/deals/${dealId}/context`).send({
      context
    })

    return response.body.data
  } catch (e) {
    return false
  }
}

/**
 * approve deal context
 */
export async function approveContext(dealId, contextId) {
  try {
    const response = await new Fetch()
      .patch(`/deals/${dealId}/context/${contextId}/approved`)
      .send({ approved: true })

    return response.body.data
  } catch (e) {
    return false
  }
}

export default {
  getContexts,
  updateContext,
  approveContext
}
