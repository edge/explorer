// Copyright (C) 2021 Edge Network Technologies Ltd
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file or at https://opensource.org/licenses/MIT.

module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {
    }
  },
  variants: {
    extend: {}
  },
  corePlugins: {
    container: false
  },
  plugins: [
    require('./src/tailwind')
  ]
}
