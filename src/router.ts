import { createRouter, createWebHistory, type Router } from 'vue-router'

import { decideAccess, type AccessDecision } from './access'
import { isContentEditor, loadUser, login } from './auth'
import { isMobileDevice, readDeviceHints } from './device'
import CallbackView from './views/CallbackView.vue'
import HomeView from './views/HomeView.vue'
import MobileOnlyView from './views/MobileOnlyView.vue'
import StudioView from './views/StudioView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    isPublicPage?: boolean
    requiresContentRole?: boolean
    isAllowedOnLaptop?: boolean
  }
}

export const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/studio',
      name: 'studio',
      component: StudioView,
      meta: { requiresContentRole: true },
    },
    {
      path: '/mobile-only',
      name: 'mobile-only',
      component: MobileOnlyView,
      meta: { isAllowedOnLaptop: true },
    },
    { path: '/callback', name: 'callback', component: CallbackView, meta: { isPublicPage: true } },
    { path: '/:unknownPath(.*)', redirect: { name: 'home' } },
  ],
})

router.beforeEach(async (destination) => {
  const isPublicPage: boolean = destination.meta.isPublicPage === true
  const isSignedIn: boolean = isPublicPage || (await loadUser()) !== null
  const decision: AccessDecision = decideAccess({
    isPublicPage,
    requiresContentRole: destination.meta.requiresContentRole === true,
    isAllowedOnLaptop: destination.meta.isAllowedOnLaptop === true,
    isSignedIn,
    isContentEditor: isContentEditor.value,
    isMobileDevice: isMobileDevice(readDeviceHints()),
  })
  if (decision === 'login') {
    await login(destination.fullPath)
    return false
  }
  if (decision === 'allow') {
    return true
  }
  return { name: decision }
})
