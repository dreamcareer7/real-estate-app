import _ from 'underscore'

import Fetch from '../../../services/fetch'

/**
 * Update a touch.
 * @param {object} touch The touch.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns updated touch.
 */
export async function updateTouch(touch, query = {}) {
  if (!touch || !touch.id) {
    throw new Error('Touch id is required.')
  }

  try {
    const fields = ['description', 'id', 'timestamp', 'activity_type', 'type']

    touch = _.omit(_.pick(touch, fields), value => value == null)

    const response = await new Fetch()
      .put(`/crm/touches/${touch.id}`)
      .query(query)
      .send(touch)

    return response.body.data
  } catch (error) {
    throw error
  }
}