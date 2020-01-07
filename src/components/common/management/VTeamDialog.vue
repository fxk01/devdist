<!-- 新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogTeamTitle" :visible.sync="dialogTeamVisible" :close-on-click-modal="false" @close="closeTeamDialog">
        <el-form :model="dialogTeamForm" ref="dialogTeamForm" label-width="100px">
            <el-form-item v-if="dialogTeamTitle === '新建團隊' || dialogTeamTitle === '編輯團隊'" label="團隊名稱：" prop="BT_Name" :rules="[
                { required: true, message: '請輸入團隊名稱', trigger: 'blur' },
                { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{1,20}$/, message: '請輸入格式為中文、英文、數字' }
            ]">
                <el-input v-model="dialogTeamForm.BT_Name" maxlength="20" />
            </el-form-item>
            <el-form-item v-if="dialogTeamTitle !== '編輯團隊'" label="負責人：" prop="BT_ManagerID" :rules="[
                { required: dialogTeamTitle === '新建團隊' ? false : true, message: '請選擇負責人', trigger: 'change' }
            ]">
                <el-select v-model="dialogTeamForm.BT_ManagerID" no-data-text="暫無數據" placeholder="請選擇">
                    <el-option v-for="(item, index) in dialogStaffList" :key="index" :label="item.Stf_Name" :value="item.Stf_ID"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeTeamDialog">取消</el-button>
            <el-button type="primary" @click="confirmTeamDialog('dialogTeamForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VTeamDialog',
        props: ['dialogTeamTitle', 'dialogTeamData'],
        data() {
            return {
                dialogTeamVisible: false,    //团队弹框是否显示
                dialogStaffList: [],    //未分配员工列表
                dialogTeamForm: {   //团队表单
                    BT_Name: '',   //团队名称
                    BT_ManagerID: ''  //负责人
                }
            }
        },
        mounted() {
            this.showTeamDialog('dialogTeamForm');
        },
        methods: {
            //获取未分配员工
            getStaffList() {
                this.$post('/api/BasicsApi/GetStafferList')
                .then((res) => {
                    this.dialogStaffList = res.Info;
                });
            },
            //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框-显示
            showTeamDialog(formName) {
                this.getStaffList();
                if(this.dialogTeamTitle === '編輯團隊') {
                    this.dialogTeamForm = Object.assign({}, this.dialogTeamData);
                }
                this.dialogTeamVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框-确定
            confirmTeamDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '', params = {};
                        switch(this.dialogTeamTitle) {
                            case '新建團隊':
                                url = '/api/BasicsApi/AddTeam';
                                params = this.dialogTeamForm;
                            break;
                            case '編輯團隊':
                                url = '/api/BasicsApi/UpdTeamName';
                                params = {
                                    BT_ID: this.dialogTeamData.BT_ID,
                                    BT_Name: this.dialogTeamForm.BT_Name
                                };
                            break;
                            case '設置負責人':
                            case '更換負責人':
                                url = '/api/BasicsApi/UpdTeamManager';
                                params = {
                                    BT_ID: this.dialogTeamData.BT_ID,
                                    BT_ManagerID: this.dialogTeamForm.BT_ManagerID
                                };
                            break;
                        }
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: this.dialogTeamTitle + '成功'
                            });
                            this.dialogTeamVisible = false;
                            this.$emit('hideTeamDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框-关闭
            closeTeamDialog() {
                this.dialogTeamVisible = false;
                this.$emit('hideTeamDialog');
            }
        }
    }
</script>