<!-- 组件-销售动态 -->
<template>
    <div>
        <ul v-if="stepData.length" class="v-step">
            <li v-for="(item, index) in stepData">
                <i class="icon el-icon-document"></i>
                <div class="v-step-title">{{item.BF_Time | hkDate('dateHM')}}</div>
                <div class="correlation">
                    <i class="follow-icon"></i>
                    <div v-if="item.BF_Method" class="follow-way">跟進方式：{{item.BF_Method}}</div>
                    <template v-if="item.BF_ChangeStatusFrom === item.BF_ChangeStatusTo">
                        <div class="follow-title">{{item.BF_ChangeStatusFrom}}</div>
                    </template>
                    <template v-else>
                        <div v-if="item.BF_Target === '線索'" class="follow-title">
                            線索狀態由 <span :class="{
                                'c-00b050': item.BF_ChangeStatusFrom === '可持續跟進',
                                'c-ff003a': item.BF_ChangeStatusFrom === '拒絕關閉'
                            }">{{item.BF_ChangeStatusFrom}}</span> 更改為 <span :class="{
                                'c-00b050': item.BF_ChangeStatusTo === '可持續跟進',
                                'c-ff003a': item.BF_ChangeStatusTo === '拒絕關閉'
                            }">{{item.BF_ChangeStatusTo}}</span>
                        </div>
                        <div v-else class="follow-title">
                            客戶狀態由 <span :class="{
                                'c-538ddb': item.BF_ChangeStatusFrom === '意向客戶',
                                'c-ffc000': item.BF_ChangeStatusFrom === '成交客戶',
                                'c-963634': item.BF_ChangeStatusFrom === '保單客戶',
                                'c-ff003a': item.BF_ChangeStatusFrom === '擱置客戶'
                            }">{{item.BF_ChangeStatusFrom}}</span> 更改為 <span :class="{
                                'c-538ddb': item.BF_ChangeStatusTo === '意向客戶',
                                'c-ffc000': item.BF_ChangeStatusTo === '成交客戶',
                                'c-963634': item.BF_ChangeStatusTo === '保單客戶',
                                'c-ff003a': item.BF_ChangeStatusTo === '擱置客戶'
                            }">{{item.BF_ChangeStatusTo}}</span>
                        </div>
                    </template>
                    <div class="follow-desc">{{item.BF_Description}}</div>
                </div>
            </li>
        </ul>
        <div v-else class="v-no-data">暫無數據</div>
    </div>
</template>

<script>
    export default {
        name: 'VStep',
        props: ['stepType'],
        data() {
            return {
                stepData: []
            }
        },
        mounted() {
            this.getStep();
        },
        methods: {
            //获取销售动态
            getStep() {
                const params = {
                    BF_Target: this.stepType,
                    BF_TargetID: this.stepType === '線索' ? JSON.parse(this.$route.query.obj).Busi_CID : this.$route.query.Cst_Code
                };
                this.$post('/api/FollowApi/GetFollowList', params)
                .then((res) => {
                    this.stepData = res.Info;
                });
            }
        }
    }
</script>