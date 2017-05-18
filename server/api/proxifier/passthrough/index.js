import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()

import config from '../../../../config/private'

const app = new Koa()

router.post('/proxifier', bodyParser(), async ctx => {
  const headers = ctx.headers
  const data = ctx.request.body

  try {
    // remove base_url because current fetcher middleware add it by itself
    const endpoint = headers['x-endpoint'].replace(config.api.url, '')

    // get method
    const method = headers['x-method']

    const response = await ctx
      .fetch(endpoint, method)
      .set({ Authorization: headers['authorization'] })
      .send(data)

    ctx.body = response.body

  } catch(e) {
    ctx.status = e.response.status
    ctx.body = e.response.text
  }
})

module.exports = app.use(router.routes())
