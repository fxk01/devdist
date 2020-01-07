let routerArr = [{
  name: 'notBMTarget',
  path: '/bm/notTarget',
  component: resolve => require(['@/components/pages/sales/bm/notBMTarget.vue'], resolve),
  meta: { title: '無銷售目標' }
  }, {
  name: 'notSetTarget',
  path: '/bm/notSetTarget',
  component: resolve => require(['@/components/pages/sales/bm/notSetTarget.vue'], resolve),
  meta: { title: '未設置目標' }
  }, {
  name: 'setTarget',
  path: '/bm/setTarget',
  component: resolve => require(['@/components/pages/sales/bm/setTarget.vue'], resolve),
  meta: { title: '已設置目標' }
  }, {
  name: 'gmNotTarget',
  path: '/gm/notSetTarget',
  component: resolve => require(['@/components/pages/sales/gm/notTarget.vue'], resolve),
  meta: { title: '未設置目標' }
  }, {
  name: 'setTarget',
  path: '/gm/setTarget',
  component: resolve => require(['@/components/pages/sales/gm/setTarget.vue'], resolve),
  meta: { title: '已設置目標' }
}];

export default routerArr