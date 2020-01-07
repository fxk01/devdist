<!-- 新建日程弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogScheduleTitle" :visible.sync="dialogSchedleVisible" :close-on-click-modal="false" @close="closeScheduleDialog">
        <el-form :model="dialogScheduleForm" ref="dialogScheduleForm" label-width="100px">
            <el-form-item label="任務內容：" prop="BS_Description" :rules="[
                { required: true, message: '請輸入跟進描述', trigger: 'blur' }
            ]">
                <el-input v-model="dialogScheduleForm.BS_Description" type="textarea" rows="3" maxlength="500" />
            </el-form-item>
            <el-form-item label="開始時間：" prop="BS_TimeStart" :rules="[
                { required: true, message: '請選擇開始時間', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogScheduleForm.BS_TimeStart"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    :picker-options="limitStartDate"
                    placeholder="選擇日期時間"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="結束時間：" prop="BS_TimeEnd" :rules="[
                { required: true, message: '請選擇結束時間', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogScheduleForm.BS_TimeEnd"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    :picker-options="limitEndDate"
                    placeholder="選擇日期時間"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="提醒時間：" prop="TipTimeType">
                <el-select v-model="dialogScheduleForm.TipTimeType" placeholder="請選擇">
                    <el-option v-for="(item, index) in $store.state.reminderTimeList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="staffIdentity === '保險代理人'" label="關聯客戶：" prop="Cst_ID">
                <el-select v-model="dialogScheduleForm.Cst_ID" filterable placeholder="請選擇" no-data-text="暫無數據" no-match-text="無匹配數據">
                    <el-option v-for="(item, index) in $store.state.relevanceCustomerList" :key="index" :value="item.Cst_ID" :label="item.Cst_Name"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeScheduleDialog">取消</el-button>
            <el-button type="primary" @click="confirmSchedleDialog('dialogScheduleForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VScheduleDialog',
        props: ['dialogScheduleTitle', 'dialogScheduleData'],
        data() {
            const $this = this;
            return {
                dialogSchedleVisible: false,    //新建日程弹框是否显示
                dialogScheduleForm: {   //新建日程表单
                    BS_Description: '',   //任务内容
                    BS_TimeStart: '',   //开始时间
                    BS_TimeEnd: '',   //结束时间
                    TipTimeType: '準時',    //提醒时间
                    Cst_ID: '' //关联客户
                },
                limitStartDate: {    //开始日期限制
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                        // if ($this.dialogScheduleForm.BS_TimeEnd) {
                        //     //如果结束时间不为空，则小于结束时间
                        //     return time.getTime() < Date.now() - 8.64e7 || new Date($this.dialogScheduleForm.BS_TimeEnd).getTime() < time.getTime()
                        // } else {
                        //     //结束时间不选时，开始时间最大值大于等于当天
                        //     return time.getTime() < Date.now() - 8.64e7
                        // }
                    }
                },
                limitEndDate: {    //结束日期限制
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                        // if ($this.dialogScheduleForm.BS_TimeStart) {
                        //     //如果开始时间不为空，则结束时间大于开始时间
                        //     return time.getTime() < new Date($this.dialogScheduleForm.BS_TimeStart).getTime() - 8.64e7
                        // } else {
                        //     //开始时间不选时，结束时间最大值大于等于当天
                        //     return time.getTime() < Date.now() - 8.64e7
                        // }
                    }
                },
                staffIdentity: sessionStorage.getItem('fc_staffIdentity')
            }
        },
        mounted() {
            this.showSchedleDialog('dialogScheduleForm');
        },
        methods: {
            //新建日程弹框-显示
            showSchedleDialog(formName) {
                this.$store.dispatch('getTypeData', '提醒時間');
                this.$store.dispatch('getRelevanceCustomer');
                if(this.dialogScheduleTitle === '新建日程') {
                    this.dialogScheduleForm.BS_TimeStart = this.comm.formatDate(new Date(), 'yyyy-MM-dd hh:mm');
                    this.dialogScheduleForm.BS_TimeEnd = this.comm.formatDate(this.comm.commDateModified('hour', 1, new Date(), '+'), 'yyyy-MM-dd hh:mm');
                } else {
                    this.dialogScheduleForm = this.dialogScheduleData;
                    this.dialogScheduleForm.BS_TimeStart = this.comm.formatDate(new Date(this.dialogScheduleData.BS_TimeStart), 'yyyy-MM-dd hh:mm');
                    this.dialogScheduleForm.BS_TimeEnd = this.comm.formatDate(new Date(this.dialogScheduleData.BS_TimeEnd), 'yyyy-MM-dd hh:mm');
                }
                this.dialogSchedleVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //新建日程弹框-确定
            confirmSchedleDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '';
                        if(this.dialogScheduleTitle === '新建日程') {
                            url = '/api/BasicsApi/AddSchedule';
                        } else if(this.dialogScheduleTitle === '編輯日程') {
                            url = '/api/BasicsApi/UpdSchedule';
                        }
                        this.$post(url, this.dialogScheduleForm)
                        .then((res) => {
                            this.$message.closeAll();
                            this.$message({
                                type: 'success',
                                message: this.dialogScheduleTitle === '新建日程' ? '日程添加成功': '編輯成功'
                            });
                            this.dialogSchedleVisible = false;
                            this.$emit('hideScheduleDialog', true);
                        })
                        .catch(err => {

                        });
                    } else {
                        return false;
                    }
                });
            },
            //新建日程弹框-关闭
            closeScheduleDialog() {
                this.dialogSchedleVisible = false;
                this.$emit('hideScheduleDialog');
            }
        }
    }
</script>