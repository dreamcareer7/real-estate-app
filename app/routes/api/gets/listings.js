// api/gets/listings.js
module.exports = (app, config) => {
  app.get('/api/listings/search',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/listings/search?mls_number=' + req.query.mls_number
    const access_token = req.query.access_token
    fetch(endpoint,{
      method: 'get',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token
      }
    })
    .then(response => {
      if (response.status >= 400) {
        let error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return res.end(JSON.stringify(error))
      }
      return response.json()
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    })
  })
}