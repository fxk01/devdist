<template>
  <div class="staffSet container">
    <v-top>
      <div class="v-top-left-title" slot="leftTitle">
        <img class="icon" src="@/assets/images/icon-GMSet.png"/>
        设置
      </div>

      <div class="v-top-title" slot="title">
        <div style="background-color: #ffffff;">
          <el-table
              :data="tableData"
              border
              style="width: 100%">
            <el-table-column label="序號">
              <template slot-scope="scope">
                <span>{{scope.row['SerialId']}}</span>
              </template>
            </el-table-column>
            <el-table-column label="節日">
              <template slot-scope="scope">
                <span>{{scope.row['BH_Description']}}</span>
              </template>
            </el-table-column>
            <el-table-column label="日期">
              <template slot-scope="scope">
                <span>{{scope.row['BH_Date'].split('T')[0]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" class="ax-u13951-text edit-primary-but" @click="dialogMdrtEdit = true, ruleForm.valueEdit = scope.row['BH_Description'], BH_ID = scope.row['BH_ID'], ruleForm.date = scope.row['BH_Date'].split('T')[0]">編輯</el-button>

                <el-button type="danger" class="ax-u13951-text ml-35 edit-primary-danger" @click="deleteDiaLogSubFinalFuc(scope)">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
              layout="total, sizes, prev, pager, next"
              @current-change="changeSize"
              @size-change="changeSizeCur"
              :page-size="curPageSize"
              :current-page="PageIndex"
              :total="TotalCount">
          </el-pagination>
        </div>
      </div>

      <div class="v-top-operation" slot="correlation" @click="dialogMdrtAdd = true">
        <el-button type="primary" size="mini" icon="el-icon-plus" class="btn-ec0928">新增</el-button>
      </div>
    </v-top>

    <el-dialog :visible.sync="diaLogSubFinal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogSub">
      <div class="subFinalClass">
        <img src="@/assets/images/gth.png" class="va-middle">
        <span class="va-middle sub-ok-text">確認刪除當前節日嗎？</span>
        <p class="va-middle tip-ok-text">刪除後無法恢復，請謹慎操作！</p>

        <ul class="subFinalUl">
          <li class="but1" @click="okFinaFuc">确定</li>
          <li class="but2" @click="diaLogSubFinal = false">取消</li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="dialogMdrtAdd" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogEdit">
      <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px" class="demo-ruleForm">
        <el-form-item label="節日" prop="valueEdit" required>
          <el-select v-model="ruleFormAdd.valueEdit" placeholder="请选择">
            <el-option
                v-for="(item, index) in optionsEdit"
                :key="index"
                :label="item.BO_Value"
                :value="item.BO_Value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期" prop="date" required>
          <el-date-picker
              v-model="ruleFormAdd.date"
              :picker-options='pickerOptions1'
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMdrtAdd = false">取 消</el-button>
        <el-button type="primary" @click="submitFormAdd('ruleFormAdd')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="編輯" :visible.sync="dialogMdrtEdit" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogEdit">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="節日" prop="valueEdit" required>
          <el-select v-model="ruleForm.valueEdit" placeholder="请选择">
            <el-option
                v-for="(item, index) in optionsEdit"
                :key="index"
                :label="item.BO_Value"
                :value="item.BO_Value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期" prop="date" required>
          <el-date-picker
              v-model="ruleForm.date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMdrtEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明
   * @date 2019/12/3
  */

  import VTop from '@/components/common/VTop.vue';

  export default {
    name: 'staffSet',
    data() {
      return {
        activeName: 'first',
        diaLogSubFinal: false,
        dialogMdrtAdd: false,
        dialogMdrtEdit: false,
        dialogProductAdd: false,
        dialogProductEdit: false,
        BH_ID: '',
        setTab: 0,
        PageIndex: 1,
        curPageSize: 10,
        pageSize: 1,
        TotalCount: null,
        tableData: [],
        tableProductData: [],
        optionsEdit: [],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },
        ruleForm: {
          valueEdit: '',
          date: '',
        },
        rules: {
          valueEdit: [
            { required: true, message: '節日不能爲空' },
          ],
          date: [
            { required: true, message: '日期不能爲空' },
          ],
        },
        ruleFormAdd: {
          valueEdit: '',
          date: '',
        },
        rulesAdd: {
          valueEdit: [
            { required: true, message: '節日不能爲空' },
          ],
          date: [
            { required: true, message: '日期不能爲空' },
          ],
        },
      }
    },
    components: {
      VTop,
    },
    mounted() {
      this.GetPageHolidayFuc();
      this.$store.dispatch('getTypeData', '節假日').then(() => {
        this.optionsEdit = this.$store.state['optionsEdit'];
      });
    },
    watch: {
      dialogMdrtAdd(val) {
        if(!val) {
          this.$refs['ruleFormAdd'].resetFields();
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/api/BasicsApi/UpdHoliday', {
              BH_ID: this.BH_ID,
              BH_Date: this.ruleForm['date'],
              BH_Description: this.ruleForm['valueEdit']
            }).then(res => {
              if(res['IsSuccess']) {
                this.GetPageHolidayFuc(this.PageIndex, this.curPageSize);
                this.dialogMdrtEdit = false;
              } else {
                this.$message(res.Message);
              }
            }).catch(error => {

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/api/BasicsApi/AddHoliday', {
              BH_Date: this.ruleFormAdd.date,
              BH_Description: this.ruleFormAdd.valueEdit,
            }).then(res => {
              if(res['IsSuccess']) {
                this.GetPageHolidayFuc(this.PageIndex, this.curPageSize);
                this.dialogMdrtAdd = false;
              } else {
                this.$message(res.Message);
              }
            }).catch(error => {

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      GetPageHolidayFuc(p = 1, page = 10) {
        this.$post('/api/BasicsApi/GetPageHoliday', {
          PageIndex: p,
          PageSize: page
        }).then(res => {
          if(res['IsSuccess']) {
            this.tableData = res['Datas'];
            this.TotalCount = res['TotalCount']
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      changeSize(page) {
        this.PageIndex = page;
        this.GetPageHolidayFuc(this.PageIndex, this.curPageSize);
      },
      okFinaFuc() {
        this.$post('/api/BasicsApi/DelHoliday', {
          BH_ID: this.BH_ID,
        }).then(res => {
          if(res['IsSuccess']) {
            this.GetPageHolidayFuc(this.PageIndex, this.curPageSize);
            this.$message({
              type: 'success',
              message: '刪除成功'
            });
            // this.diaLogSubFinal = false;
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      deleteDiaLogSubFinalFuc(scope) {
        // this.diaLogSubFinal = true;
        const h = this.$createElement;
        this.BH_ID = scope.row['BH_ID'];
        this.$confirm('', '提示', {
          message: h('div', null, [
            h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定刪除節假日【' + scope['row']['BH_Description'] + '】嗎?'),
            h('div', {style: 'fontSize:12px;'}, '刪除後無法恢復，請謹慎操作！')
          ]),
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.okFinaFuc()
        }).catch(() => {

        });
      },
      changeSizeCur(v) {
        this.PageIndex = 1;
        this.curPageSize = v;
        this.GetPageHolidayFuc(1, v)
      }
    }
  }
</script>

<style lang="less">
  .staffSet {
    padding-top: 12px;
    .v-top-left-title {
      position: relative !important;
    }
    .ml-35 {
      margin-left: 35px;
    }
    .ax-u13951-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      color: #0099FF;
      font-size: 14px;
      line-height: normal;
      cursor: pointer;
    }
    .el-pagination {
      text-align: right;
      padding: 10px 0 5px 0;
      /*padding: 25px 0 20px 0;*/
    }
    .v-top-operation {
      cursor: pointer;
      z-index: 2;
    }
    .el-tabs__nav {
      float: inherit;
    }
    .el-tabs__nav-wrap::after {
      position: relative;
    }
    .el-tabs__active-bar {
      height: 0;
    }
    .el-table td, .el-table th.is-leaf {
      text-align: center;
    }
    //.el-dialog, .el-pager li {
    //  background: inherit;
    //}
    .el-tabs__content {
      background-color: #fff;
    }
    .el-tabs__item {
      padding: 0 20px;
      display: inline-block;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      width: 200px;
      border: 1px solid #ec0928;
      color: #ec0928;
      height: 30px;
      line-height: 30px;
    }
    #tab-first {
      border-right: none;
      border-radius: 5px 0 0 5px;
    }
    #tab-second {
      border-radius: 0 5px 5px 0;
    }
    .el-tabs__item.is-active {
      color: #fff;
      border-color: #ec0928 !important;
      background-color: #ec0928 !important;
      -webkit-box-shadow: -1px 0 0 0 #ec0928 !important;
      box-shadow: -1px 0 0 0 #ec0928 !important;
    }
    .subFinalClass {
      width: 460px;
      height: 185px;
      text-align: center;
      padding-top: 45px;
    }
    .sub-ok-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #333333;
      line-height: normal;
      padding-left: 20px;
      display: inline-block;
    }
    .tip-ok-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #333333;
      line-height: normal;
      padding: 8px 0 0 55px;
    }
    .subFinalUl {
      float: left;
      position: absolute;
      bottom: 0;
    }
    .subFinalUl li {
      width: 230px;
      height: 50px;
      background: inherit;
      border: none;
      background-color: rgba(238, 58, 67, 1);
      border-radius: 0;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 50px;
      cursor: pointer;
      float: left;
    }
    .subFinalUl li.but2 {
      background-color: rgba(242, 242, 242, 1);
      color: #333333;
    }
    .dialogSub {
      .el-dialog {
        width: 460px;
        background: #ffffff;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
    .dialogEdit {
      .el-form-item__label-year {
        font-size: 14px;
        color: #606266;
        padding-left: 32px;
      }
      .el-dialog__footer {
        text-align: center;
      }
    }
    .edit-primary-but {
      color: #FFF;
      background-color: #409EFF;
      border-color: #409EFF;
      height: 30px;
      padding: 0;
      width: 60px;
      font-size: 12px;
    }
    .edit-primary-danger {
      color: #FFF;
      height: 30px;
      padding: 0;
      width: 60px;
      font-size: 12px;
    }
  }
</style>