<!-- 组件-线索详细信息 -->
<template>
    <div class="white-box" style="margin-top:-10px;border-top:1px solid #ddd;">
        <div class="centent">
            <el-form label-width="90px">
                <el-row :gutter="20">
                    <el-col v-if="clueData.StfPostName === '銷售總監'" :span="12">
                        <el-form-item label="渠道來源：">{{clueData.Busi_CFromDtl | returnStr}}</el-form-item>
                    </el-col>
                    <el-col v-if="clueData.StfPostName === '銷售主管' || clueData.StfPostName === '保險代理人'" :span="12">
                        <el-form-item label="線索來源：">{{clueData.Busi_CFrom | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地區：">{{clueData.Busi_CLocation | returnStr}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="出生日期：">{{comm.dealWithTime(clueData.Busi_CBirthDay, 'date') | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年齡：">{{clueData.Age}}歲</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="職業：">{{clueData.Busi_COccupation | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年收入：">{{clueData.Busi_CIncome | returnStr}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="學歷：">{{clueData.Busi_CEducation | returnStr}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="婚姻狀況：">{{clueData.Busi_CMarriage | returnStr}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="標籤：">
                            <template v-if="tagData.length">
                                <div class="tag-box">
                                    <template v-if="$route.path === '/poolGmDetails' || $route.path === '/poolBmDetails'">
                                        <el-tag v-for="(item, index) in tagData.slice(0, (tagData.length > unfoleLen && !isUnfold) ? unfoleLen : tagData.length)" :key="index">{{item.CT_Name}}</el-tag>
                                    </template>
                                    <template v-else>
                                        <el-tag v-for="(item, index) in tagData.slice(0, (tagData.length > unfoleLen && !isUnfold) ? unfoleLen : tagData.length)" :key="index" :type="item.CT_Type === '系統' ? '' : 'success'" :closable="item.CT_Type === '系統' ? false : true" @close="closeTag(item)">{{item.CT_Name}}</el-tag>
                                    </template>
                                </div>
                            </template>
                            <template v-else>-</template>
                            <span v-if="tagData.length > unfoleLen" class="is-unfold" @click="isUnfold = !isUnfold">{{isUnfold ? '收起' : '展開'}}<i :class="isUnfold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
                            <span v-if="staffIdentity === '保險代理人'" class="add-tag" @click="showAddTagDialog">添加更多標籤</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 添加标签弹框 -->
        <v-add-tag-dialog v-if="isAddTagDialog" dialogType="線索" @hideAddTagDialog="hideAddTagDialog"></v-add-tag-dialog>
    </div>
</template>

<script>
    import VAddTagDialog from '@/components/common/VAddTagDialog.vue';
    export default {
        name: 'VClueDetails',
        props: ['clueData'],
        data() {
            return {
                unfoleLen: 50,
                isUnfold: false,
                isAddTagDialog: false,
                tagData: [],
                staffIdentity: sessionStorage.getItem('fc_staffIdentity')
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
                this.$post('/api/ClueApi/GetClueTagListByClueID', { Busi_CID: JSON.parse(this.$route.query.obj).Busi_CID })
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
                   this.$post('/api/ClueApi/DelClueTag', { CT_ID: obj.CT_ID })
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