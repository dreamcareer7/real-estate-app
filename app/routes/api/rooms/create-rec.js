// api/posts/create-rec.js
module.exports = (app, config) => {
  app.post('/api/create-rec',(req, res) => {
    const api_url = config.api.url
    const id = req.body.id
    const mls_number = req.body.mls_number
    const endpoint = api_url + '/rooms/' + id + '/recs'
    const access_token = req.body.access_token
    const request_object = {
      mls_number
    }
    console.log(endpoint, request_object)
    fetch(endpoint, {
      method: 'post',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          response
        }
        return res.json(error)
      }
      return response.json()
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}