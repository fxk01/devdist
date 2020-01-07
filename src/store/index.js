import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui';
import { post } from '../../src/utils/http';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        regionList: [], //所在地区
        channelList: [],    //渠道来源
        poolStatusList: [], //公海池-状态
        allocationToTeam: [],   //分配至-团队
        allocationToAgent: [],  //分配至-代理人
        cluelList: [],    //线索来源
        cluelFollowList: [],    //跟进状态
        cluelFollowWay: [], //跟进方式
        customerStatusList: [], //客户状态
        relatedProductsList: [],    //关联产品
        chanceStatusList: [],    //机会状态
        policyStatusList: [],   //保单状态
        physicalRequirementsList: [],   //体检要求
        reminderTimeList: [],   //提醒时间
        relevanceCustomerList: [],  //关联客户
        followObjectList: [],  //跟进对象
        teamMembersList: [],    //团队成员
        scheduleStatusList: [], //日程状态
        areaCodeList: [], //区号
        annualIncomeList: [],   //年收入
        roleList: [],   //角色
        timeFrame: [],  //時間範圍-工作檯
        timeRangeList: [],  //时间范围
        matchCustomerList: [],  //匹配客户
        recoveryStatusList: [], //收回状态
        getPromptInfoData: {}, //工作台消息
        optionsEdit: [], //节假日
    },
    mutations: {
        //获取所在地区
        getRegionData (state, data) {
            state.regionList = data;
        },
        //根据类型获取数据
        getTypeData (state, obj) {
            switch (obj.type) {
                case '渠道來源':
                    state.channelList = obj.list;
                break;
                case '總監已處理':
                case '總監未處理':
                case '主管已處理':
                case '主管未處理':
                    state.poolStatusList = obj.list;
                break;
                case '線索來源':
                    state.cluelList = obj.list;
                break;
                case '跟進狀態':
                    state.cluelFollowList = obj.list;
                break;
                case '跟進方式':
                    state.cluelFollowWay = obj.list;
                break;
                case '客戶狀態':
                    state.customerStatusList = obj.list;
                break;
                case '產品類型':
                    state.relatedProductsList = obj.list;
                break;
                case '機會狀態':
                    state.chanceStatusList = obj.list;
                break;
                case '保單狀態':
                    state.policyStatusList = obj.list;
                break;
                case '體檢要求':
                    state.physicalRequirementsList = obj.list;
                break;
                case '提醒時間':
                    state.reminderTimeList = obj.list;
                break;
                case '跟進對象':
                    state.followObjectList = obj.list;
                break;
                case '日程狀態':
                    state.scheduleStatusList = obj.list;
                break;
                case '區號':
                    state.areaCodeList = obj.list;
                break;
                case '年收入':
                    state.annualIncomeList = obj.list;
                break;
                case '收回狀態':
                    state.recoveryStatusList = obj.list;
                    break;
                case '角色':
                    state.roleList = obj.list;
                break;
                case '時間範圍':
                    state.timeFrame = obj.list;
                    state.timeRangeList = obj.list;
                break;
                case '節假日':
                    state.optionsEdit = obj.list;
                break;
            }
        },
        //获取分配至-团队
        getAllocationToTeam(state, data) {
            state.allocationToTeam = data;
        },
        //获取分配至-代理人
        getAllocationToAgent(state, data) {
            state.allocationToAgent = data;
        },
        //获取团队成员列表
        getTeamMembers(state, data) {
            state.teamMembersList = data;
        },
        //获取关联客户
        getRelevanceCustomer(state, data) {
            state.relevanceCustomerList = data;
        },
        //匹配客户
        getMatchCustomer(state, data) {
            state.matchCustomerList = data;
        },
        //获取工作台消息
        getPromptInfoFuc(state, data) {
            state.getPromptInfoData = data;
        }
    },
    actions: {
        //获取所在地区
        getRegionData (context, country) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetCityList', { Country: country }).then(res => {
                    if (res.IsSuccess) {
                        context.commit('getRegionData', res.Info);
                        resolve('ok');
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        })
                        reject('err');
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    })
                    reject('err');
                })
            })
        },
        //根据类型获取数据
        getTypeData (context, type) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetOptionsByType', { BO_Type: type }).then(res => {
                    if (res.IsSuccess) {
                        let obj = {
                            list: res.Info,
                            type: type
                        }
                        context.commit('getTypeData', obj);
                        resolve();
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        })
                        reject();
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    })
                    reject();
                })
            })
        },
        //获取分配至-总监获取团队
        getAllocationToTeam (context) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetTeamList').then(res => {
                    if (res.IsSuccess) {
                        context.commit('getAllocationToTeam', res.Info);
                        resolve('ok');
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        })
                        reject('err');
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    })
                    reject('err');
                })
            })
        },
        //获取分配至-主管获取代理人（参数团队ID）
        getAllocationToAgent (context, id) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetMemberListByID', { BT_ID: id }).then(res => {
                    if (res.IsSuccess) {
                        context.commit('getAllocationToAgent', res.Info);
                        resolve('ok');
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        })
                        reject('err');
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    })
                    reject('err');
                })
            })
        },
        //获取团队成员列表
        getTeamMembers (context) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetMemberListByManID').then(res => {
                    if (res.IsSuccess) {
                        context.commit('getTeamMembers', res.Info);
                        resolve('ok');
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        })
                        reject('err');
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    })
                    reject('err');
                })
            })
        },
        //获取关联客户
        getRelevanceCustomer(context) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetRelaCustList').then(res => {
                    if (res.IsSuccess) {
                        context.commit('getRelevanceCustomer', res.Info);
                        resolve('ok');
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        })
                        reject('err');
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    })
                    reject('err');
                })
            })
        },
        //获取工作台消息
        getPromptInfoFuc(context) {
            return new Promise((resolve, reject) => {
                post('/api/BasicsApi/GetPromptInfo').then(res => {
                    if (res.IsSuccess) {
                        context.commit('getPromptInfoFuc', res.Info);
                        resolve('ok');
                    } else {
                        Message({
                            message: res.Message,
                            type: 'error'
                        });
                        reject('err');
                    }
                }).catch(err => {
                    Message({
                        message: '請求錯誤',
                        type: 'error'
                    });
                    reject('err');
                })
            })
        }
    }
});

export default store