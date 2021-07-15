import Vue from 'vue'
import Router from 'vue-router'
import Load from '@/pages/load/index'
import IndexPage from '@/components/IndexPage'
import HelloWorld from '@/pages/new/HelloWorld'
import plane from '@/pages/plane/index'
import ship from '@/pages/ship/index'
import car from '@/pages/car/index'
import railways from '@/pages/railways/index'

Vue.use(Router)

export const appRouter = new Router({
  routes: [{
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
      redirect:'plane',
      children: [{
        path: '/plane',
        name: 'plane',
        component: plane,
      }, {
        path: '/ship',
        name: 'ship',
        component: ship,
      }, {
        path: '/car',
        name: 'car',
        component: car,
      }, {
        path: '/railways',
        name: 'railways',
        component: railways,
      }]
    },
    {
      path: '/login',
      name: 'Load',
      component: Load
    },
    {
      path: '/newpage',
      name: 'HelloWorld',
      component: HelloWorld
    }

  ]
})
