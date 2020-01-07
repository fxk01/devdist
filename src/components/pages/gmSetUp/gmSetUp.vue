<template>
  <div class="gmSetUp container">
    <v-top>
      <div class="v-top-left-title" slot="leftTitle">
        <img class="icon" src="@/assets/images/icon-GMSet.png"/>
        设置
      </div>

      <div class="v-top-title" slot="title">
        <el-tabs v-model="activeName" @tab-click="changeTabSize">
          <el-tab-pane label="MDRT設置" name="first">
            <div>
              <el-table
                  :data="tableData"
                  border
                  style="width: 100%">
                <el-table-column label="年度">
                  <template slot-scope="scope">
                    <span>{{scope.row['Year']}}年</span>
                  </template>
                </el-table-column>
                <el-table-column label="保费金额（HKD）">
                  <template slot-scope="scope">
                    <span>{{scope.row['MDRTMoney'] | thousandth}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row['Status'] !== 1" type="primary" class="ax-u13951-text edit-primary-but" @click="dialogMdrtEdit = true, BO_Code = scope['row']['BO_Code'], ruleForm.name = scope['row']['MDRTMoney']">編輯</el-button>

                    <el-button v-if="scope.row['Status'] !== 1" type="danger" class="ax-u13951-text ml-35 edit-primary-danger" @click="diaLogSubFinal = true, BO_Code = scope['row']['BO_Code']">提交终稿</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="產品設置" name="second">
            <div>
              <el-table
                  :data="tableProductData"
                  border
                  style="width: 100%">
                <el-table-column label="序號">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="產品名稱">
                  <template slot-scope="scope">
                    <span>{{scope.row['ProductName']}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" class="ax-u13951-text edit-primary-but" @click="dialogProductEdit = true, BO_Code = scope['row']['BO_Code'], ruleFormProductEdit.name = scope['row']['ProductName']">編輯</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <el-pagination
              layout="total, sizes, prev, pager, next"
              @current-change="changeSize"
              @size-change="changeSizeCur"
              :current-page="currentPage"
              :page-size="curPageSize"
              :total="TotalCount"
          >
          </el-pagination>
        </el-tabs>
      </div>

      <div class="v-top-operation" slot="correlation" @click="setTab === 1 ? dialogProductAdd = true : dialogMdrtAdd = true">
        <el-button type="primary" size="mini" icon="el-icon-plus" class="btn-ec0928">新增</el-button>
      </div>
    </v-top>

    <el-dialog :visible.sync="diaLogSubFinal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogSub">
      <div class="subFinalClass">
        <img src="@/assets/images/gth.png" class="va-middle">
        <span class="va-middle sub-ok-text">确定提交最終的銷售目標嗎？</span>
        <p class="va-middle tip-ok-text">提交后将不再允許修改銷售目標，请谨慎操作！</p>

        <ul class="subFinalUl">
          <li class="but1" @click="okFinaFuc">确定</li>
          <li class="but2" @click="diaLogSubFinal = false">取消</li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="dialogMdrtAdd" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogEdit">
      <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px" class="demo-ruleForm">
        <el-form-item label="年度" prop="year">
          <el-date-picker
              v-model="ruleFormAdd.year"
              type="year"
              value-format="yyyy"
              :picker-options="pickerOptions1"
              placeholder="选择年">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="保費金額" prop="money">
          <el-input v-model.number="ruleFormAdd.money" maxlength="9"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMdrtAdd = false">取 消</el-button>
        <el-button type="primary" @click="submitFormAdd('ruleFormAdd')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="dialogProductAdd" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogEdit">
      <el-form :model="ruleFormProduct" :rules="rulesProduct" ref="ruleFormProduct" label-width="100px" class="demo-ruleForm">
        <el-form-item label="產品名稱" prop="name">
          <el-input v-model="ruleFormProduct.name" maxlength="100"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogProductAdd = false">取 消</el-button>
        <el-button type="primary" @click="submitFormProduct('ruleFormProduct')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="編輯" :visible.sync="dialogMdrtEdit" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogEdit">
      <p style="margin-bottom: 23px;">
        <span class="el-form-item__label-year">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度</span>
        <span>&nbsp;&nbsp;2020</span>
      </p>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="保費金額" prop="name">
          <el-input v-model.number="ruleForm.name" maxlength="9"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMdrtEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="編輯" :visible.sync="dialogProductEdit" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialogEdit">
      <el-form :model="ruleFormProductEdit" :rules="rulesProductEdit" ref="ruleFormProductEdit" label-width="100px" class="demo-ruleForm">
        <el-form-item label="產品名稱" prop="name">
          <el-input v-model="ruleFormProductEdit.name" maxlength="100"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogProductEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitFormProductEdit('ruleFormProductEdit')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明 GM设置
   * @date 2019/11/18
  */

  import VTop from '@/components/common/VTop.vue';

  export default {
    name: 'gmSetUp',
    data() {
      return {
        activeName: 'first',
        diaLogSubFinal: false,
        dialogMdrtAdd: false,
        dialogMdrtEdit: false,
        dialogProductAdd: false,
        dialogProductEdit: false,
        currentPage: 1,
        curPageSize: 10,
        BO_Code: '',
        setTab: 0,
        pageSize: 1,
        TotalCount: null,
        tableData: [],
        tableProductData: [],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },
        ruleForm: {
          name: '',
        },
        rules: {
          name: [
            { required: true, message: '保費金額不能爲空' },
            { type: 'number', message: '保費金額必須爲整數' }
          ],
        },
        ruleFormAdd: {
          year: '',
          money: '',
        },
        rulesAdd: {
          year: {
            required: true, message: '請選擇年度'
          },
          money: [
            { required: true, message: '保費金額不能爲空' },
            { type: 'number', message: '保費金額必須爲整數' }
          ],
        },
        ruleFormProduct: {
          name: ''
        },
        rulesProduct: {
          name: {
            required: true, message: '產品名稱不能爲空'
          }
        },
        ruleFormProductEdit: {
          name: ''
        },
        rulesProductEdit: {
          name: {
            required: true, message: '產品名稱不能爲空'
          }
        }
      }
    },
    components: {
      VTop,
    },
    mounted() {
      this.getPageMDRTFuc()
    },
    watch: {
      dialogMdrtAdd(val) {
        if(!val) {
          this.$refs['ruleFormAdd'].resetFields();
        }
      },
      dialogProductAdd(val) {
        if(!val) {
          this.$refs['ruleFormProduct'].resetFields();
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/api/BasicsApi/UpdMDRT', {
              BO_Code: this.BO_Code,
              MDRTMoney: this.ruleForm.name
            }).then(res => {
              if(res['IsSuccess']) {
                this.getPageMDRTFuc(this.currentPage, this.curPageSize);
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
            this.$post('/api/BasicsApi/AddMDRT', {
              Year: this.ruleFormAdd.year,
              MDRTMoney: this.ruleFormAdd.money
            }).then(res => {
              if(res['IsSuccess']) {
                this.getPageMDRTFuc(this.currentPage, this.curPageSize);
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
      submitFormProduct(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/api/BasicsApi/AddProduct', {
              ProductName: this.ruleFormProduct.name
            }).then(res => {
              if(res['IsSuccess']) {
                this.getPageProductFuc(this.currentPage, this.curPageSize);
                this.dialogProductAdd = false;
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
      submitFormProductEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/api/BasicsApi/UpdProduct', {
              BO_Code: this.BO_Code,
              ProductName: this.ruleFormProductEdit.name
            }).then(res => {
              if(res['IsSuccess']) {
                this.getPageProductFuc(this.currentPage, this.curPageSize);
                this.dialogProductEdit = false;
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
      getPageMDRTFuc(p = 1, page = 10) {
        this.$post('/api/BasicsApi/GetPageMDRT', {
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
      getPageProductFuc(p = 1, page = 10) {
        this.$post('/api/BasicsApi/GetPageProduct', {
          PageIndex: p,
          PageSize: page
        }).then(res => {
          if(res['IsSuccess']) {
            this.tableProductData = res['Datas'];
            this.TotalCount = res['TotalCount'];
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      changeSize(page) {
        this.currentPage = page;
        this.setTab === 1 ? this.getPageProductFuc(page, this.curPageSize) : this.getPageMDRTFuc(page, this.curPageSize);
      },
      changeTabSize(page) {
        this.currentPage = 1;
        this.setTab = parseInt(page.index);
        this.setTab === 1 ? this.getPageProductFuc(this.currentPage, this.curPageSize) : this.getPageMDRTFuc(this.currentPage, this.curPageSize);
      },
      okFinaFuc() {
        this.$post('/api/BasicsApi/LockMDRTStatus', {
          BO_Code: this.BO_Code,
        }).then(res => {
          if(res['IsSuccess']) {
            this.getPageMDRTFuc(this.currentPage, this.curPageSize);
            this.diaLogSubFinal = false;
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      changeSizeCur(v) {
        this.currentPage = 1;
        this.curPageSize = v;
        this.setTab === 1 ? this.getPageProductFuc(1, v) : this.getPageMDRTFuc(1, v);
      }
    }
  }
</script>

<style lang="less" src="./gmSetUp.less"></style>