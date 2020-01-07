import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export interface DuplicateContacts {
  id: number
  contacts: IContact[]
}

export async function getContactDuplicateContacts(
  contactId: UUID
): Promise<ApiResponseBody<DuplicateContacts>> {
  try {
    const response = await new Fetch()
      .get(`/contacts/${contactId}/duplicates`)
      .query(defaultQuery)

    return response.body
  } catch (error) {
    throw error
  }
}
