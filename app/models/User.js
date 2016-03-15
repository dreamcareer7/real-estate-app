// models/User.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import superagent from 'superagent'
import config from '../../config/public'

export default {
  create: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/signup'
    const request_object = params.user
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  signin: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/signin'
    const request_object = {
      email: params.email,
      password: params.password,
      invite: params.invite
    }
    fetch(endpoint, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  forgotPassword: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/forgot-password'
    const request_object = {
      email: params.email
    }

    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },

  resetPassword: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/reset-password'
    const request_object = {
      token: encodeURIComponent(params.token),
      password: params.password
    }

    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          'status': 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  verifyPhone: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/verify-phone'

    const request_object = {
      code: params.code,
      token: encodeURIComponent(params.token)
    }

    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  getRooms: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/rooms?access_token=' + params.access_token

    fetch(endpoint)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  createContacts: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/create-contacts'
    const contacts = params.contacts
    const access_token = params.access_token
    const request_object = {
      contacts,
      access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  editContact: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/edit-contact'
    const contact = params.contact
    const access_token = params.access_token
    const request_object = {
      contact,
      access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  deleteContact: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/delete-contact'
    const contact_id = params.contact_id
    const access_token = params.access_token
    const request_object = {
      contact_id,
      access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  getContacts: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    const endpoint = api_host + '/api/contacts?access_token=' + params.access_token

    fetch(endpoint)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  edit: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/edit-user'
    const request_object = {
      user: params.user,
      access_token: params.access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          body: response.body
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  uploadImage: (params, callback) => {
    const api_url = config.api_url
    const endpoint = api_url + '/attachments'
    const request = superagent.post(endpoint)
    const file = params.files[0]
    request.set('authorization', 'Bearer ' + params.access_token)
    request.attach('media', file)
    request.end((err, response) => {
      return callback(false, response)
    })
  },
  editProfilePic: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/edit-profile-pic'
    const request_object = {
      profile_image_url: params.profile_image_url,
      access_token: params.access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  editPassword: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/edit-password'
    const request_object = {
      old_password: params.old_password,
      new_password: params.new_password,
      access_token: params.access_token
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  }
}