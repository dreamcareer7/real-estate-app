import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import AppStore from '../../../app/stores/AppStore'
import routes from '../../../app/routes'
import config from '../../../config/webpack'

function matcher(location) {
  return new Promise((resolve) => {
    match({ routes, location }, (error, redirectLocation, renderProps) =>
      resolve({ error, redirectLocation, renderProps }))
  })
}

export default async function (ctx) {
  const { error, redirectLocation, renderProps } = await matcher(ctx.request.url)

  if (error) {
    ctx.status = 500
    ctx.body = error.message
  } else if (redirectLocation) {
    ctx.status = 302
    ctx.redirect(redirectLocation.pathname + redirectLocation.search)
  }
  else if (renderProps) {

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) > -1) {
      if (/\/dashboard\/mls\/(\w+)/.test(ctx.request.url)) {
        await ctx.render('app', {
          title: 'Rechat',
          body: renderToString( <RouterContext data={AppStore.data} {...renderProps} /> )
        })
        return
      }
      if (ctx.request.url.indexOf('signout') !== -1) {
        ctx.session.user = null
        let redirect_to = '/'
        if (ctx.query.redirect_to)
          redirect_to = ctx.query.redirect_to
        await ctx.redirect(redirect_to)
        return
      }
      await ctx.render('app')
      return

    } else {
      await ctx.render('development', {
        title: '_DEV_',
        jsBundle: `${config.compile.publicPath}/${config.compile.jsBundle}`
      })
    }
  } else {
    ctx.status = 404
    ctx.body = 'Not found!'
  }
}
