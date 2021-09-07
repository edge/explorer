// Copyright (C) 2021 Edge Network Technologies Ltd
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file or at https://opensource.org/licenses/MIT.

module.exports = {
  assetsDir: 'assets/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'XE Explorer'
        return args
      })
  }
}
