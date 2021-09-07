// Copyright (C) 2021 Edge Network Technologies Ltd
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file or at https://opensource.org/licenses/MIT.

require('dotenv').config()

module.exports = {
  http: {
    port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8000
  }
}
