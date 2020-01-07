<!-- 组件-客户详细信息 -->
<template>
    <div class="white-box" style="margin-top:-10px;border-top:1px solid #ddd;">
        <div class="centent">
            <el-form label-width="90px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="線索來源：">{{customerData.Cst_From | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地區：">{{customerData.Cst_Location | returnStr}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="出生日期：">{{comm.dealWithTime(customerData.Cst_BirthDay, 'date') | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年齡：">{{customerData.Age}}歲</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="職業：">{{customerData.Cst_Occupation | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年收入：">{{customerData.Cst_Income | returnStr}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="學歷：">{{customerData.Cst_Education | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="婚姻狀況：">{{customerData.Cst_Marriage | returnStr}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="標籤：">
                            <template v-if="customerData.StfPostName !== '保險代理人'">
                                <template v-if="tagData.length">
                                    <div class="tag-box">
                                        <el-tag v-for="(item, index) in tagData.slice(0, (tagData.length > unfoleLen && !isUnfold) ? unfoleLen : tagData.length)" :key="index" :type="item.BCT_Type === '系統' ? '' : 'success'">{{item.BCT_Name}}</el-tag>
                                    </div>
                                </template>
                                <template v-else>-</template>
                                <span v-if="tagData.length > unfoleLen" class="is-unfold" @click="isUnfold = !isUnfold">{{isUnfold ? '收起' : '展開'}}<i :class="isUnfold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
                            </template>
                            <template v-else>
                                <template v-if="tagData.length">
                                    <div class="tag-box">
                                        <el-tag v-for="(item, index) in tagData.slice(0, (tagData.length > unfoleLen && !isUnfold) ? unfoleLen : tagData.length)" :key="index" :type="item.BCT_Type === '系統' ? '' : 'success'" :closable="item.BCT_Type === '系統' ? false : true" @close="closeTag(item)">{{item.BCT_Name}}</el-tag>
                                    </div>
                                </template>
                                <template v-else>-</template>
                                <span v-if="tagData.length > unfoleLen" class="is-unfold" @click="isUnfold = !isUnfold">{{isUnfold ? '收起' : '展開'}}<i :class="isUnfold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
                                <span class="add-tag" @click="showAddTagDialog">添加更多標籤</span>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 添加标签弹框 -->
        <v-add-tag-dialog v-if="isAddTagDialog" dialogType="客戶" @hideAddTagDialog="hideAddTagDialog"></v-add-tag-dialog>
    </div>
</template>

<script>
    import VAddTagDialog from '@/components/common/VAddTagDialog.vue';
    export default {
        name: 'VCustomerDetails',
        props: ['customerData'],
        data() {
            return {
                unfoleLen: 50,
                isUnfold: false,
                isAddTagDialog: false,
                tagData: [],
            }
        },
        components: {
            VAddTagDialog
        },
        mounted() {
            this.getTagData();
        },
        methods: {
            //获取标签列表
            getTagData() {
                this.$post('/api/CustomerApi/GetCustTagListByCode', { Cst_Code: this.$route.query.Cst_Code })
                .then((res) => {
                    this.tagData = res.Info;
                    if(this.tagData.length <= this.unfoleLen) {
                        this.isUnfold = false;
                    }
                });
            },
            //删除标签
            closeTag(obj) {
                this.$confirm('確定要刪除該標籤嗎?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
               }).then(() => {
                   this.$post('/api/CustomerApi/DelCustomerTag', { BCT_ID: obj.BCT_ID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '刪除成功'
                        });
                        this.getTagData();
                    });
               }).catch(() => {
                 
               });
            },
            //显示添加标签弹框
            showAddTagDialog() {
                this.isAddTagDialog = true;
            },
            //隐藏添加标签弹框
            hideAddTagDialog(v) {
                if(v) {
                    this.getTagData();
                }
                this.isAddTagDialog = false;
            }
        }
    }
</script>