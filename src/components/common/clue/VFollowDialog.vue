<!-- 写跟进弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogFollowTitle" :visible.sync="dialogFollowVisible" :close-on-click-modal="false" @close="closeFollowDialog">
        <el-form :model="dialogFollowForm" ref="dialogFollowForm" label-width="100px">
            <el-form-item label="跟進描述" prop="BF_Description" :rules="[
                { required: true, message: '請輸入跟進描述', trigger: 'blur' }
            ]">
                <el-input v-model="dialogFollowForm.BF_Description" type="textarea" rows="3" maxlength="500" />
            </el-form-item>
            <el-form-item label="跟進時間" prop="BF_Time" :rules="[
                { required: true, message: '請選擇跟進時間', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogFollowForm.BF_Time"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    :picker-options="limitFollowDate"
                    placeholder="選擇日期時間"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="跟進方式" prop="BF_Method" :rules="[
                { required: true, message: '請選擇跟進方式', trigger: 'change' }
            ]">
                <el-select v-model="dialogFollowForm.BF_Method" placeholder="請選擇">
                    <el-option v-for="(item, index) in $store.state.cluelFollowWay" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="dialogFollowTarget === '線索'" label="跟進狀態" prop="FollowStatus" :rules="[
                { required: true, message: '請選擇跟進狀態', trigger: 'change' }
            ]">
                <el-select v-model="dialogFollowForm.FollowStatus" placeholder="請選擇">
                    <el-option v-for="(item, index) in dialogFollowStatusList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="dialogFollowTarget === '客戶'" label="客戶狀態" prop="FollowStatus" :rules="[
                { required: true, message: '請選擇客戶狀態', trigger: 'change' }
            ]">
                <el-select v-model="dialogFollowForm.FollowStatus" placeholder="請選擇">
                    <el-option v-for="(item, index) in dialogFollowStatusList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="下次跟進時間" prop="BF_NextTime">
                <el-date-picker
                    v-model="dialogFollowForm.BF_NextTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    :picker-options="limitNewFollowDate"
                    placeholder="選擇日期時間"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeFollowDialog">取消</el-button>
            <el-button type="primary" @click="confirmFollowDialog('dialogFollowForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VFollowDialog',
        props: ['dialogFollowTitle', 'dialogFollowTarget', 'dialogFollowStatus'],
        data() {
            const $this = this;
            return {
                dialogFollowVisible: false,    //写跟进弹框是否显示
                dialogFollowStatusList: [],    //跟进状态列表、客户状态列表
                dialogFollowForm: {   //写跟进表单
                    BF_Description: '',   //跟进描述
                    BF_Time: '',   //跟进时间
                    BF_Method: '',    //跟进方式
                    FollowStatus: '', //跟进状态、客户状态
                    BF_NextTime: ''    //下次跟进时间
                },
                limitFollowDate: {    //跟进日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                limitNewFollowDate: {    //下次跟进日期限制
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                }
            }
        },
        mounted() {
            this.showFollowDialog('dialogFollowForm');
        },
        methods: {
            //写跟进-显示
            showFollowDialog(formName) {
                this.dialogFollowForm.BF_Time = this.comm.formatDate(new Date(), 'yyyy-MM-dd hh:mm');
                this.$store.dispatch('getTypeData', '跟進方式').then(res => {
                    this.dialogFollowWay = this.$store.state.cluelFollowWay;
                })
                if(this.dialogFollowTarget === '線索') {
                    this.$store.dispatch('getTypeData', '跟進狀態').then((res) => {
                        let filterList = [], statusList = this.$store.state.cluelFollowList;
                        // switch(this.dialogFollowStatus) {
                        //     case '未跟進':
                        //         filterList = statusList;
                        //     break;
                        //     case '可持續跟進':
                        //     case '拒絕關閉':
                        //         filterList = statusList.filter(item => item.BO_Value !== '未跟進');
                        //     break;
                        // }
                        filterList = statusList.filter(item => item.BO_Value !== '未跟進');
                        this.dialogFollowStatusList = filterList;
                    })
                } else {
                    this.$store.dispatch('getTypeData', '客戶狀態').then((res) => {
                        let filterList = [], statusList = this.$store.state.customerStatusList;
                        switch(this.dialogFollowStatus) {
                            case '初步接觸':
                                filterList = statusList.filter(item => item.BO_Value === '初步接觸' || item.BO_Value === '意向客戶' || item.BO_Value === '擱置客戶');
                            break;
                            case '意向客戶':
                                filterList = statusList.filter(item => item.BO_Value === '意向客戶' || item.BO_Value === '成交客戶' || item.BO_Value === '擱置客戶');
                            break;
                            case '成交客戶':
                                filterList = statusList.filter(item => item.BO_Value === '成交客戶' || item.BO_Value === '保單客戶' || item.BO_Value === '擱置客戶');
                            break;
                            case '保單客戶':
                                filterList = statusList.filter(item => item.BO_Value == '保單客戶');
                            break;
                            case '擱置客戶':
                                filterList = statusList.filter(item => item.BO_Value === '意向客戶' || item.BO_Value === '擱置客戶');
                            break;
                        }
                        this.dialogFollowStatusList = filterList;
                    })
                }
                this.dialogFollowVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //写跟进-确定
            confirmFollowDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = this.dialogFollowTarget === '線索' ? '/api/FollowApi/AddClueFollow' : '/api/FollowApi/AddCustFollow';
                        const params = Object.assign({}, this.dialogFollowForm, { BF_Target: this.dialogFollowTarget, BF_TargetID: this.dialogFollowTarget === '線索' ? JSON.parse(this.$route.query.obj).Busi_CID : this.$route.query.Cst_Code });
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '添加跟進記錄成功'
                            });
                            this.dialogFollowVisible = false;
                            this.$emit('hideFollowDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //写跟进-关闭
            closeFollowDialog() {
                this.dialogFollowVisible = false;
                this.$emit('hideFollowDialog');
            }
        }
    }
</script>