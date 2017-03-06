import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/delete-room', async (ctx, next) => {

  const { id } = ctx.request.query

  try {
    const response = await ctx.fetch(`/rooms/${id}`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
