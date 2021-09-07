// Copyright (C) 2021 Edge Network Technologies Ltd
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file or at https://opensource.org/licenses/MIT.

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import titleMixin from './mixins/titleMixin'
import './index.css'
import './utils'

createApp(App)
  .use(router)
  .mixin(titleMixin)
  .mount('#app')
