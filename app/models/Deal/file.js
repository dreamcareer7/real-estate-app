import Fetch from '../../services/fetch'

export async function uploadStashFile(dealId, file, fileName = null) {
  try {
    return await new Fetch()
      .upload(`/deals/${dealId}/files`)
      .attach('file', file, fileName || file.name)
  } catch (e) {
    return null
  }
}

export async function uploadTaskFile(taskId, file, fileName = null) {
  try {
    return await new Fetch()
      .upload(`/tasks/${taskId}/attachments`)
      .attach('file', file, fileName || file.name)
  } catch (e) {
    return null
  }
}

export async function copyTaskFile(taskId, file) {
  try {
    return await new Fetch().post(`/tasks/${taskId}/attachments`).send(file)
  } catch (e) {
    throw e
  }
}

/**
 * delete attachment
 */
export async function deleteStashFile(dealId, files) {
  try {
    await new Fetch()
      .delete(`/deals/${dealId}/files`)
      .query({ 'id[]': [files] })
  } catch (e) {
    throw e
  }
}

export default {
  uploadStashFile,
  uploadTaskFile,
  deleteStashFile,
  copyTaskFile
}
