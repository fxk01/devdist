import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';

Vue.use(Router);


// 解决重复点击导航路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}

const router = new Router({
    //mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    name: 'workbenchGm',
                    path: '/workbenchGm',
                    component: resolve => require(['../components/pages/workbench/gm.vue'], resolve),
                    meta: { title: '工作臺-銷售總監' }
                },
                {
                    name: 'workbenchBm',
                    path: '/workbenchBm',
                    component: resolve => require(['../components/pages/workbench/bm.vue'], resolve),
                    meta: { title: '工作臺-銷售主管' },
                    children: [{
                        name: 'workbenchBm',
                        path: '/workbenchBm',
                        component: resolve => require(['../components/pages/workbench/bm/bm.vue'], resolve),
                        meta: { title: '工作臺-銷售主管' },
                    }, {
                        name: 'recoverCustomers',
                        path: '/recoverCustomers',
                        component: resolve => require(['../components/pages/workbench/bm/recoverCustomers.vue'], resolve),
                        meta: { title: '收回客戶' }
                    }, {
                        name: 'messageList',
                        path: '/messageList',
                        component: resolve => require(['../components/pages/workbench/bm/messageList.vue'], resolve),
                        meta: { title: '消息列表' }
                    }]
                },
                {
                    name: 'workbenchAm',
                    path: '/workbenchAm',
                    component: resolve => require(['../components/pages/workbench/am.vue'], resolve),
                    meta: { title: '工作臺-保險代理人' },
                    children: [{
                        name: 'workbenchAm',
                        path: '/workbenchAm',
                        component: resolve => require(['../components/pages/workbench/am/am.vue'], resolve),
                        meta: { title: '工作臺-保險代理人' },
                    }, {
                        name: 'AssignCustomers',
                        path: '/assignCustomers',
                        component: resolve => require(['../components/pages/workbench/am/assignCustomers.vue'], resolve),
                        meta: { title: '指派客戶' }
                    }]
                },
                {
                    name: 'poolGmIndex',
                    path: '/poolGmIndex',
                    component: resolve => require(['../components/pages/pool/poolGmIndex.vue'], resolve),
                    meta: { title: '公海池-銷售總監' }
                },
                {
                    name: 'poolGmDetails',
                    path: '/poolGmDetails',
                    component: resolve => require(['../components/pages/pool/poolGmDetails.vue'], resolve),
                    meta: { title: '公海池詳情-銷售總監' }
                },
                {
                    name: 'poolBmIndex',
                    path: '/poolBmIndex',
                    component: resolve => require(['../components/pages/pool/poolBmIndex.vue'], resolve),
                    meta: { title: '公海池-銷售主管' }
                },
                {
                    name: 'poolBmDetails',
                    path: '/poolBmDetails',
                    component: resolve => require(['../components/pages/pool/poolBmDetails.vue'], resolve),
                    meta: { title: '公海池詳情-銷售主管' }
                },
                {
                    name: 'clueIndex',
                    path: '/clueIndex',
                    component: resolve => require(['../components/pages/clue/clueIndex.vue'], resolve),
                    meta: { title: '線索' }
                },
                {
                    name: 'clueDetails',
                    path: '/clueDetails',
                    component: resolve => require(['../components/pages/clue/clueDetails.vue'], resolve),
                    meta: { title: '線索詳情' }
                },
                {
                    name: 'customerIndex',
                    path: '/customerIndex',
                    component: resolve => require(['../components/pages/customer/customerIndex.vue'], resolve),
                    meta: { title: '客戶' }
                },
                {
                    name: 'customerDetails',
                    path: '/customerDetails',
                    component: resolve => require(['../components/pages/customer/customerDetails.vue'], resolve),
                    meta: { title: '客戶詳情' }
                },
                {
                    name: 'chanceIndex',
                    path: '/chanceIndex',
                    component: resolve => require(['../components/pages/chance/chanceIndex.vue'], resolve),
                    meta: { title: '機會' }
                },
                {
                    name: 'contractIndex',
                    path: '/contractIndex',
                    component: resolve => require(['../components/pages/contract/contractIndex.vue'], resolve),
                    meta: { title: '合同' }
                },
                {
                    name: 'scheduleBmIndex',
                    path: '/scheduleBmIndex',
                    component: resolve => require(['../components/pages/schedule/scheduleBmIndex.vue'], resolve),
                    meta: { title: '日程計劃-銷售主管' }
                },
                {
                    name: 'scheduleAmIndex',
                    path: '/scheduleAmIndex',
                    component: resolve => require(['../components/pages/schedule/scheduleAmIndex.vue'], resolve),
                    meta: { title: '日程計劃-保險代理人' }
                },
                {
                    name: 'followIndex',
                    path: '/followIndex',
                    component: resolve => require(['../components/pages/follow/followIndex.vue'], resolve),
                    meta: { title: '跟進記錄' }
                },
                {
                    name: 'staffHrIndex',
                    path: '/staffHrIndex',
                    component: resolve => require(['../components/pages/management/staffHrIndex.vue'], resolve),
                    meta: { title: '員工管理-HR' }
                },
                {
                    name: 'staffSet',
                    path: '/staffSet',
                    component: resolve => require(['../components/pages/management/staffSet.vue'], resolve),
                    meta: { title: '设置-HR' }
                },
                {
                    name: 'teamGmIndex',
                    path: '/teamGmIndex',
                    component: resolve => require(['../components/pages/management/teamGmIndex.vue'], resolve),
                    meta: { title: '團隊管理-銷售總監' }
                },
                {
                    name: 'staffBmIndex',
                    path: '/staffBmIndex',
                    component: resolve => require(['../components/pages/management/staffBmIndex.vue'], resolve),
                    meta: { title: '員工管理-銷售主管' }
                },
                {
                    name: 'performanceGmIndex',
                    path: '/performanceGmIndex',
                    component: resolve => require(['../components/pages/analysis/gm/performanceGmIndex.vue'], resolve),
                    meta: { title: '業績分析-銷售總監' }
                },
                {
                    name: 'customerGmIndex',
                    path: '/customerGmIndex',
                    component: resolve => require(['../components/pages/analysis/gm/customerGmIndex.vue'], resolve),
                    meta: { title: '客戶分析-銷售總監' }
                },
                {
                    name: 'laberGmIndex',
                    path: '/laberGmIndex',
                    component: resolve => require(['../components/pages/analysis/gm/laberGmIndex.vue'], resolve),
                    meta: { title: '標籤分析-銷售總監' }
                },
                {
                    name: 'productivityGmIndex',
                    path: '/productivityGmIndex',
                    component: resolve => require(['../components/pages/analysis/gm/productivityGmIndex.vue'], resolve),
                    meta: { title: '績效分析-銷售總監' }
                },
                {
                    name: 'productivityGmDetails',
                    path: '/productivityGmDetails',
                    component: resolve => require(['../components/pages/analysis/gm/productivityGmDetails.vue'], resolve),
                    meta: { title: '績效分析詳情-銷售總監' }
                },
                {
                    name: 'performanceBmIndex',
                    path: '/performanceBmIndex',
                    component: resolve => require(['../components/pages/analysis/bm/performanceBmIndex.vue'], resolve),
                    meta: { title: '業績分析-銷售主管' }
                },
                {
                    name: 'customerBmIndex',
                    path: '/customerBmIndex',
                    component: resolve => require(['../components/pages/analysis/bm/customerBmIndex.vue'], resolve),
                    meta: { title: '客戶分析-銷售主管' }
                },
                {
                    name: 'laberBmIndex',
                    path: '/laberBmIndex',
                    component: resolve => require(['../components/pages/analysis/bm/laberBmIndex.vue'], resolve),
                    meta: { title: '標籤分析-銷售主管' }
                },
                {
                    name: 'productivityBmIndex',
                    path: '/productivityBmIndex',
                    component: resolve => require(['../components/pages/analysis/bm/productivityBmIndex.vue'], resolve),
                    meta: { title: '績效分析-銷售主管' }
                },
                {
                    name: 'productivityBmDetails',
                    path: '/productivityBmDetails',
                    component: resolve => require(['../components/pages/analysis/bm/productivityBmDetails.vue'], resolve),
                    meta: { title: '績效分析詳情-銷售主管' }
                },
                {
                    name: 'notBMTarget',
                    path: '/TaskManager',
                    component: resolve => require(['@/components/pages/sales/bm/notBMTarget.vue'], resolve),
                    meta: { title: '主管銷售目標' }
                },
                {
                    name: 'gmNotTarget',
                    path: '/TaskDirector',
                    component: resolve => require(['@/components/pages/sales/gm/notTarget.vue'], resolve),
                    meta: { title: '總監銷售目標' }
                },
                {
                    name: 'gmSetUp',
                    path: '/setting',
                    component: resolve => require(['@/components/pages/gmSetUp/gmSetUp.vue'], resolve),
                    meta: { title: 'GM设置' }
                },
            ]
        },
        {
            name: 'login',
            path: '/login',
            component: resolve => require(['../components/pages/Login.vue'], resolve)
        },
        {
            name: 'forgetpassword',
            path: '/forgetpassword',
            component: resolve => require(['../components/pages/ForgetPassword.vue'], resolve)
        },
        {
            name: 'updatepassword',
            path: '/updatepassword',
            component: resolve => require(['../components/pages/UpdatePassword.vue'], resolve)
        },
        {
            name: '404',
            path: '/404',
            component: resolve => require(['../components/pages/404.vue'], resolve)
        },
        {
            name: '403',
            path: '/403',
            component: resolve => require(['../components/pages/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('fc_username');
    if(!role && to.path !== '/login' && to.path !== '/forgetpassword') {
        next('/login');
    } else if(to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        if(to.path === '/') {
            switch(sessionStorage.getItem('fc_staffIdentity')) {
                case '銷售總監': next('/workbenchGm'); break;
                case '銷售主管': next('/workbenchBm'); break;
                case '保險代理人': next('/workbenchAm'); break;
                case 'HR': next('/staffHrIndex'); break;
                default: next();
            }
        } else {
            next();
        }
    }
    Message.closeAll();
});

export default router