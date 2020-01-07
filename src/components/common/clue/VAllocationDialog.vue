<!-- 分配弹框 -->
<template>
    <el-dialog class="dialog-component" title="分配客戶" :visible.sync="dialogAllocationVisible" :close-on-click-modal="false" @close="closeAllocationDialog">
        <el-form :model="dialogAllocationForm" ref="dialogAllocationForm" label-width="80px">
            <el-form-item label="姓名：">{{dialogAllocationForm.name}}</el-form-item>
            <el-form-item v-if="staffIdentity === '銷售總監'" label="分配至：" prop="allocationTo" :rules="[
                { required: true, message: '請選擇團隊', trigger: 'change' }
            ]">
                <el-select v-model="dialogAllocationForm.allocationTo" placeholder="請選擇團隊" no-data-text="暫無數據">
                    <el-option v-for="(item, index) in dialogAllocationForm.allocationToList" :key="index" :value="item.BT_ID" :label="item.BT_Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="staffIdentity === '銷售主管'" label="分配至：" prop="allocationTo" :rules="[
                { required: true, message: '請選擇代理人', trigger: 'change' }
            ]">
                <el-select v-model="dialogAllocationForm.allocationTo" placeholder="請選擇代理人" no-data-text="暫無數據">
                    <el-option v-for="(item, index) in dialogAllocationForm.allocationToList" :key="index" :value="item.Stf_ID" :label="item.Stf_Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="備註：" prop="remarks">
                <el-input v-model="dialogAllocationForm.remarks" type="textarea" rows="3" maxlength="500" />
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeAllocationDialog">取消</el-button>
            <el-button type="primary" @click="confirmAllocationDialog('dialogAllocationForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VAllocationDialog',
        props: ['dialogAllocationData'],
        data() {
            return {
                dialogAllocationVisible: false,    //分配客戶弹框是否显示
                dialogAllocationForm: {   //分配客戶表单
                    name: '',   //姓名
                    arrDid: [],
                    allocationToList: [],   //分配至数据列表
                    allocationTo: '',   //分配至
                    remarks: '' //备注
                },
                staffIdentity: sessionStorage.getItem('fc_staffIdentity')
            }
        },
        mounted() {
            this.showAllocationDialog('dialogAllocationForm');
        },
        methods: {
            //分配客户弹框-显示
            showAllocationDialog(formName) {
                let arrId = [], arrName = [];
                this.dialogAllocationData.map(item => {
                    arrId.push(item.Busi_CID);
                    arrName.push(item.Busi_CName);
                })
                this.dialogAllocationForm.arrDid = arrId;
                this.dialogAllocationForm.name = arrName.join('，');
                if(this.staffIdentity === '銷售總監') {
                    this.$store.dispatch('getAllocationToTeam').then(res => {
                        this.dialogAllocationForm.allocationToList = this.$store.state.allocationToTeam;
                    })
                } else if(this.staffIdentity === '銷售主管') {
                    this.$store.dispatch('getAllocationToAgent', this.dialogAllocationData[0].Busi_TeamID).then(res => {
                        this.dialogAllocationForm.allocationToList = this.$store.state.allocationToAgent;
                    })
                }
                this.dialogAllocationVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //分配客户弹框-确定
            confirmAllocationDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '', params = {}, str = '';
                        if(this.staffIdentity === '銷售總監') {
                            url = 'api/ClueApi/DistribToTeam';
                            params = {
                                LstCID: this.dialogAllocationForm.arrDid,
                                Busi_TeamID: this.dialogAllocationForm.allocationTo,
                                BCL_Description: this.dialogAllocationForm.remarks
                            };
                            str = this.dialogAllocationForm.allocationToList.find((item) => item.BT_ID === this.dialogAllocationForm.allocationTo).BT_Name;
                        } else if(this.staffIdentity === '銷售主管') {
                            url = 'api/ClueApi/DistribToStf';
                            params = {
                                LstCID: this.dialogAllocationForm.arrDid,
                                Stf_ID: this.dialogAllocationForm.allocationTo,
                                BCL_Description: this.dialogAllocationForm.remarks
                            };
                            str = this.dialogAllocationForm.allocationToList.find((item) => item.Stf_ID === this.dialogAllocationForm.allocationTo).Stf_Name;
                        }
                        const h = this.$createElement;
                        this.$confirm('', '提示', {
                            message: h('div', null, [
                                h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定分配客戶至【' + str + '】嗎?'),
                                h('div', {style: 'fontSize:12px;'}, '客戶分配后將無法撤回，請謹慎操作！')
                            ]),
                            confirmButtonText: '確定',
                            cancelButtonText: '取消',
                            closeOnClickModal: false,
                            type: 'warning'
                        }).then(() => {
                            this.$post(url, params)
                            .then((res) => {
                                this.$message({
                                    type: 'success',
                                    message: '成功分配至【' + str + '】'
                                });
                                this.dialogAllocationVisible = false;
                                this.$emit('hideAllocationDialog', true);
                            });
                        }).catch(() => {
                                
                        });
                    } else {
                        return false;
                    }
                });
            },
            //分配客户弹框-关闭
            closeAllocationDialog() {
                this.dialogAllocationVisible = false;
                this.$emit('hideAllocationDialog');
            }
        }
    }
</script>