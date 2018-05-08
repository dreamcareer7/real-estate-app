import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function getContact(contactId, query = defaultQuery) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const response = await new Fetch()
      .get(`/contacts/${contactId}`)
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
