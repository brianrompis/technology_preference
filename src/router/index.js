import Vue from 'vue'
import Router from 'vue-router'

// Routes
import AppsRoutes from './apps.routes'
import UIRoutes from './ui.routes'
import PagesRoutes from './pages.routes'
import UsersRoutes from './users.routes'
import EcommerceRoutes from './ecommerce.routes'
import LandingRoutes from './landing.routes'

Vue.use(Router)

export const routes = [
{
  path: '/',
  redirect: '/home'
},
{
  path: '/home',
  name: 'home',
  component: () => import('@/pages/Home.vue'),
},
{
  path: '/dashboard',
  name: 'dashboard',
  component: () => import('@/pages/Dashboard.vue')
},
{
  path: '/classes',
  name: 'classes',
  component: () => import('@/pages/ClassCourse.vue')
},
{
  path: '/profile',
  name: 'profile',
  component: () => import('@/pages/Profile.vue')
},
{
  path: '/certificates',
  name: 'certificates',
  component: () => import('@/pages/Certificates.vue')
},
{
  path: '/qualifications',
  name: 'qualifications',
  component: () => import('@/pages/Qualifications.vue')
},
{
  path: '/jobs',
  name: 'jobs',
  component: () => import('@/pages/Jobs.vue')
},
{
  path: '/teacher',
  name: 'teacher',
  component: () => import('@/pages/TeacherRoom.vue')
},
{
  path: '/portfolio/:id',
  name: 'portfolio',
  component: () => import('@/pages/Portfolio.vue'),
  meta: {
    layout: 'simple'
  }
},
...AppsRoutes,
...UIRoutes,
...PagesRoutes,
...UsersRoutes,
...EcommerceRoutes,
...LandingRoutes,
{
  path: '/blank',
  name: 'blank',
  component: () => import('@/pages/BlankPage.vue')
},
{
  path: '*',
  name: 'error',
  component: () => import('@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { x: 0, y: 0 }
  },
  routes
})

// Before each route update
router.beforeEach((to, from, next) => {
  return next()
})

// After each route update
router.afterEach((to, from) => {
})

export default router
