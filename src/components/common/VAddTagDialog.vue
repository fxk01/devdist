<!-- 添加标签弹框 -->
<template>
    <el-dialog class="dialog-component" title="添加標籤" :visible.sync="dialogAddTagVisible" :close-on-click-modal="false" @close="closeAddTagDialog">
        <el-form :model="dialogAddTagForm" ref="dialogAddTagForm" label-width="120px">
            <el-form-item label="輸入標籤：" prop="LstTag" :rules="[
                { required: true, message: '請選擇或輸入標籤', trigger: 'change' }
            ]">
                <el-select style="width:100%;" v-model="dialogAddTagForm.LstTag" clearable multiple filterable allow-create default-first-option :multiple-limit="20" no-data-text="暫無數據" placeholder="回車添加標籤">
                    <el-option v-for="(item, index) in knowledge" :key="index" :value="dialogType === '線索' ? item.CT_Name : item.BCT_Name"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeAddTagDialog">取消</el-button>
            <el-button type="primary" @click="confirmAddTagDialog('dialogAddTagForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VAddTagDialog',
        props: ['dialogType'],
        data() {
            return {
                dialogAddTagVisible: false,    //添加标签弹框是否显示
                dialogAddTagForm: {   //添加标签弹框表单
                    LstTag: []
                },
                knowledge: []
            }
        },
        mounted() {
            this.showAddTagDialog('dialogAddTagForm');
        },
        methods: {
            //获取标签列表
            getTagList() {
                let url = '';
                if(this.dialogType === '線索') {
                    url = '/api/ClueApi/GetClueTagListByStfID';
                } else if(this.dialogType === '客戶') {
                    url = '/api/CustomerApi/GetCustTagListByStfID';
                }
                this.$post(url)
                .then((res) => {
                    this.knowledge = res.Info;
                });
            },
            //添加标签弹框-显示
            showAddTagDialog(formName) {
                this.getTagList();
                this.dialogAddTagVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //添加标签弹框-确定
            confirmAddTagDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '', params;
                        if(this.dialogType === '線索') {
                            url = '/api/ClueApi/AddClueTag';
                            params = Object.assign({}, this.dialogAddTagForm, { Busi_CID: JSON.parse(this.$route.query.obj).Busi_CID });
                        } else if(this.dialogType === '客戶') {
                            url = '/api/CustomerApi/AddCustomerTag';
                            params = Object.assign({}, this.dialogAddTagForm, { Cst_Code: this.$route.query.Cst_Code });
                        }
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.dialogAddTagVisible = false;
                            this.$emit('hideAddTagDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //添加标签弹框-关闭
            closeAddTagDialog() {
                this.dialogAddTagVisible = false;
                this.$emit('hideAddTagDialog');
            }
        }
    }
</script>