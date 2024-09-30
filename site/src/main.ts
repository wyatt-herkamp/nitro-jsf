import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFileText,
  faGear,
  faX,
  faRightToBracket,
  faArrowLeft,
  faArrowRight,
  faAnglesRight,
  faAnglesLeft
} from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './router'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.use(createPinia())
app.use(router)
library.add(faGear)
library.add(faFileText)
library.add(faRightToBracket)
library.add(faX)

library.add(faArrowLeft)
library.add(faArrowRight)
library.add(faAnglesRight)
library.add(faAnglesLeft)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(Notifications)

app.mount('#app')
