<!-- 日程安排 -->
<template>
    <div>
        <ul v-if="scheduleList.length" class="v-schedule">
            <li v-for="(item, index) in scheduleList" :key="index">
                <i class="icon"></i>
                <div class="v-schedule-head">
                    <span class="time">{{item.BS_TimeStart | hkDate('HM')}} - {{item.BS_TimeEnd | hkDate('HM')}}</span>
                    <span class="status">
                        <i :class="{'el-icon-time' : item.BS_Status === '未開始', 'el-icon-remove-outline' : item.BS_Status === '執行中', 'el-icon-circle-check-outline' : item.BS_Status === '已結束', 'el-icon-circle-close-outline' : item.BS_Status === '已取消'}"></i> {{item.BS_Status}}</span>
                </div>
                <div class="v-schedule-body">{{item.DescShow}}</div>
                <div class="v-schedule-foot">
                    <template v-if="selectTab === '我的日程'">
                    <div align="left">
                        <span v-if="item.BS_Status !== '已取消'" class="cancel" @click="eancelSchedule(item)"><i class="el-icon-close"></i> 取消日程</span>
                    </div>
                    <div align="center">
                        <span v-if="item.BS_Status === '未開始' || item.BS_Status === '執行中'" class="edit" @click="showScheduleDialog('編輯日程', item)"><i class="el-icon-edit"></i> 編輯</span>
                    </div>
                    <div align="right">
                        <span class="del" @click="delSchedule(item)"><i class="el-icon-delete"></i> 刪除</span>
                    </div>
                    </template>
                    <template v-else>
                        <div class="to"><i class="el-icon-d-arrow-right"></i> {{item.Stf_Name}}</div>
                    </template>
                </div>
            </li>
        </ul>
        <div v-else class="v-no-schedule">
            <div>
                <img src="static/images/comm/icon_schedule.png" />
                <br /><br />
                <div>今日還沒有安排日程</div>
            </div>
        </div>
        <!-- 编辑日程弹框 -->
        <v-schedule-dialog v-if="isScheduleDialog" :dialogScheduleTitle="dialogScheduleTitle" :dialogScheduleData="dialogScheduleData" @hideScheduleDialog="hideScheduleDialog"></v-schedule-dialog>
    </div>
</template>

<script>
    import VScheduleDialog from '@/components/common/VScheduleDialog.vue';
    export default {
        name: 'VSchedule',
        props: ['selectTab', 'selectDate', 'keywords', 'scheduleStatus', 'theirSales'],
        data() {
            return {
                scheduleList: [],
                isScheduleDialog: false,
                dialogScheduleTitle: '',
                dialogScheduleData: {}
            }
        },
        components:{
            VScheduleDialog
        },
        mounted() {
            this.getSchedule();
        },
        methods: {
            //获取日程
            getSchedule() {
                let url = '', params = {};
                if(this.selectTab === '我的日程') {
                    url = '/api/BasicsApi/GetScheduleList';
                    params = {
                        CurDate: this.selectDate
                    };
                } else if(this.selectTab === '下屬日程') {
                    url = '/api/BasicsApi/GetTeamScheduleList';
                    let LstStatus = [], LstStfID = [];
                    this.scheduleStatus.map(item => {
                        LstStatus.push(item.BO_Value);
                    })
                    this.theirSales.map(item => {
                        LstStfID.push(item.Stf_ID);
                    })
                    params = {
                        CurDate: this.selectDate,
                        LstStatus: LstStatus,
                        LstStfID: LstStfID,
                        Keyword: this.keywords
                    };
                }
                this.$post(url, params)
                .then((res) => {
                    this.scheduleList = res.Info;
                })
                .catch(err => {

                });
            },
            //取消日程
            eancelSchedule(obj) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定取消日程安排嗎? '),
                        h('div', {style: 'fontSize:12px;'}, '確定後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/BasicsApi/CancleSchedule', { BS_ID: obj.BS_ID })
                    .then((res) => {
                        this.getSchedule();
                        this.$emit('refreshSchedule');
                        this.$message({
                            type: 'success',
                            message: '日程已取消'
                        });
                    })
                    .catch(err => {

                    });
                }).catch(() => {
                        
                });
            },
            //编辑日程弹框-显示
            showScheduleDialog(str, obj = {}){
                this.dialogScheduleTitle = str;
                this.dialogScheduleData = obj;
                this.isScheduleDialog = true;
            },
            //编辑日程弹框-隐藏
            hideScheduleDialog(v){
                if(v) {
                    this.getSchedule();
                }
                this.isScheduleDialog = false;
            },
            //删除日程
            delSchedule(obj) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定刪除日程安排嗎? '),
                        h('div', {style: 'fontSize:12px;'}, '刪除後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/BasicsApi/DelSchedule', { BS_ID: obj.BS_ID })
                    .then((res) => {
                        this.getSchedule();
                        this.$emit('refreshSchedule');
                        this.$message({
                            type: 'success',
                            message: '刪除成功'
                        });
                    })
                    .catch(err => {

                    });
                }).catch(() => {
                        
                });
            }
        }
    }
</script>

<style scoped>
    .v-schedule {
        margin-left: 15px;
        padding-left: 18px;
        font-size: 14px;
        color: #666666;
        border-left: 2px dotted #ff3a7f;
    }
    .v-schedule li {
        position: relative;
        margin-bottom: 25px;
        padding: 10px 15px;
        border: 1px solid #eeeeee;
        border-radius: 5px;
        background-color: #ffffff;
        box-shadow: 0 0 5px rgba(0,0,0,0.1);
    }
    .v-schedule li:last-child {
        margin-bottom: 0;
    }
    .v-schedule li .icon {
        position: absolute;
        top: -1px;
        left: -26px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #ff3a7f;
    }
    .v-schedule li:first-child .icon {
        box-shadow: 0 0 10px #ff3a7f;
    }
    .v-schedule .v-schedule-head {
        line-height: 20px;
        overflow: hidden;
    }
    .v-schedule .v-schedule-head .time {
        float: left;
        font-weight: bold;
    }
    .v-schedule .v-schedule-head .name {
        float: left;
        margin-left: 10px;
        font-size: 12px;
        color: #ee3a43;
    }
    .v-schedule .v-schedule-head .status {
        float: right;
    }
    .v-schedule .v-schedule-body {
        margin: 10px 0;
        line-height: 20px;
    }
    .v-schedule .v-schedule-foot {
        display: flex;
        justify-content: flex-end;
    }
    .v-schedule .v-schedule-foot > div {
        flex: 1;
    }
    .v-schedule .v-schedule-foot span {
        cursor: pointer;;
    }
    .v-schedule .v-schedule-foot i {
        font-weight: bold;
    }
    .v-schedule .v-schedule-foot .cancel, .v-schedule .v-schedule-foot .edit {
        color: #0099ff;
    }
    .v-schedule .v-schedule-foot .del {
        color: #ee3a43;
    }
    .v-schedule .v-schedule-foot .to {
        font-size: 12px;
        color:#000000;
    }
    .v-no-schedule {
        display: flex;
        height: 366px;
        font-size: 14px;
        text-align: center;
        color: #999999;
        align-items: center;
        justify-content: center;
    }
</style>