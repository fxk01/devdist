<!-- 处理日志 -->
<template>
    <el-table :data="flowData" empty-text="暫無數據">
        <el-table-column label="處理日期" align="center">
            <template slot-scope="scope">{{scope.row.BCL_OprTime | hkDate()}}</template>
        </el-table-column>
        <el-table-column label="操作人" prop="OprStfName" align="center"></el-table-column>
        <el-table-column label="處理事項" prop="BCL_Action" align="center"></el-table-column>
        <el-table-column label="處理備註" prop="BCL_Description" align="center"></el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'VFlow',
        data() {
            return {
                flowData: []
            }
        },
        mounted() {
            this.getFlow();
        },
        methods: {
            //获取处理日志
            getFlow() {
                const params = {
                    Busi_CID: JSON.parse(this.$route.query.obj).Busi_CID
                };
                this.$post('/api/ClueApi/GetClueLogListByCID', params)
                .then((res) => {
                    this.flowData = res.Info;
                });
            }
        }
    }
</script>