// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

require('dotenv').config()

module.exports = {
  http: {
    port: import.meta.env.HTTP_PORT ? parseInt(import.meta.env.HTTP_PORT) : 8000
  },
  proxy: {
    indexApiBasePath: import.meta.env.INDEX_API_BASE_PATH || '/api',
    indexBaseUrl: import.meta.env.INDEX_API_URL || 'https://index.test.network',
  }
}
