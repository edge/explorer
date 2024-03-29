// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

module.exports = {
  http: {
    port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8000
  },
  proxy: {
    indexApiBasePath: process.env.INDEX_API_BASE_PATH || '/api',
    indexBaseUrl: process.env.INDEX_API_URL || 'https://index.test.network',
  },
  www: {
    path: process.env.WWW_PATH || path.join(__dirname, '..', 'dist')
  }
}
