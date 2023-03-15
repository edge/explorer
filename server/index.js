// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

const config = require('./config')
const Express = require('express')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
const { createProxyMiddleware } = require('http-proxy-middleware')

// Create & configure express app
const app = new Express()
const www = path.join(__dirname, '..', 'dist')
const html = fs.readFileSync(`${www}/index.html`, 'utf8')

// Middleware
app.use(morgan('dev'))
app.use('/assets', Express.static(`${www}/assets`))

app.use(createProxyMiddleware(config.proxy.indexApiBasePath, {
  target: config.proxy.indexBaseUrl,
  changeOrigin: true,
  onProxyReq: (preq, req) => {
    preq.path = req.path.replace(config.proxy.indexApiBasePath, '')
    if (preq.path === '') preq.path = '/'
    const qs = req.query ? (new URLSearchParams(req.query)).toString() : ''
    if (qs) preq.path += `?${qs}`
    console.log(`GET ${req.path}${qs ? `?${qs}` : ''} forwarded to ${config.proxy.indexBaseUrl}${preq.path}`)
  }
}))

// Return the index page everything
app.use((req, res) => {
  res.send(html)
})

// Listen on the configured port
app.listen(config.http.port, () => {
  console.log(`Edge Explorer listening for requests on ${config.http.port}`)
})
