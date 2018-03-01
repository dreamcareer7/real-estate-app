import Fetch from '../../../services/fetch'

async function fetchContactActivities(contactId = '') {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const response = await new Fetch().get(`/contacts/${contactId}/timeline`)

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default fetchContactActivities