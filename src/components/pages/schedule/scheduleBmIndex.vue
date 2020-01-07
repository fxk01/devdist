<!-- 日程计划-销售主管 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_schedule_hover.png" />日程計劃</div>
            <div class="v-top-title" slot="title">
                <el-radio-group v-model="selectTab" class="radio-group-ec0928" size="mini" @change="changeScheduleTab">
                    <el-radio-button label="我的日程"></el-radio-button>
                    <el-radio-button label="下屬日程"></el-radio-button>
                </el-radio-group>
            </div>
            <div class="v-top-operation" slot="correlation">
                <el-button v-if="selectTab === '我的日程'" class="btn-ec0928" type="primary" size="mini" icon="el-icon-plus" @click="showScheduleDialog('新建日程')">新建日程</el-button>
                <el-button v-if="selectTab === '下屬日程'" class="btn-ec0928" type="primary" size="mini" :icon="filterStatus === true ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="filterCondition">{{filterStatus === true ? '收起' : '篩選'}}</el-button>
            </div>
        </v-top>
        <div v-if="filterStatus" class="condition">
            <table class="condition-table">
                <tr>
                    <th>日程狀態</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="scheduleStatusAll" size="mini" border :indeterminate="scheduleStatusIndeter" @change="checkScheduleStatusAll">全部</el-checkbox>
                        <el-checkbox-group v-model="scheduleStatus" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkScheduleStatus">
                            <el-checkbox v-for="(item, index) in scheduleStatusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>所屬銷售</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="theirSalesAll" size="mini" border :indeterminate="theirSalesIndeter" @change="checkTheirSalesAll">全部</el-checkbox>
                        <el-checkbox-group v-model="theirSales" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkTheirSales">
                            <el-checkbox v-for="(item, index) in theirSalesList" :key="index" :label="item" border>{{item.Stf_Name}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>關鍵詞</th>
                    <td>
                        <el-input class="w200" v-model="keywords" size="mini" maxlength="10" placeholder="請輸入日程關鍵字" />
                    </td>
                </tr>
            </table>
            <div class="p10" align="center">
                <el-button class="btn-ec0928" type="primary" size="mini" @click="queryData">查詢</el-button>
                <el-button type="info" size="mini" @click="resetForm">重置</el-button>
            </div>
        </div>
        <el-row :gutter="20">
            <el-col :span="18">
                <div class="calendar-box">
                    <div class="calendar-head">
                        <i class="el-icon-arrow-left" @click="prevDate"></i>
                        <span class="title">{{prevYear}}年{{prevMonth}}月</span>
                        <i class="el-icon-arrow-right" @click="nextDate"></i>
                        <span v-if="today !== selectDate" class="to-day" @click="toDay">回到今天</span>
                    </div>
                    <div id="current-calendar">
                        
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <!-- 日程安排 -->
                <div class="schedule-box">
                    <div class="schedule-head">日程安排</div>
                    <div class="schedule-body" style="padding-top:10px;height:416px;overflow-y:auto;">
                        <v-schedule
                            :key="updateSchedule"
                            :selectTab="selectTab" 
                            :selectDate="selectDate" 
                            :keywords="keywords"
                            :scheduleStatus="scheduleStatus"
                            :theirSales="theirSales"
                            @refreshSchedule="refreshSchedule"
                        >
                        </v-schedule>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 新建日程弹框 -->
        <v-schedule-dialog v-if="isScheduleDialog" :dialogScheduleTitle="dialogScheduleTitle" @hideScheduleDialog="hideScheduleDialog"></v-schedule-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VSchedule from '@/components/pages/schedule/VSchedule.vue';
    import VScheduleDialog from '@/components/common/VScheduleDialog.vue';
    export default {
        name: 'scheduleBMIndex',
        data() {
            return {
                filterStatus: false,
                keywords: '', //关键词
                scheduleStatusIndeter: false,
                scheduleStatusAll: true,  //日程状态-全部
                scheduleStatusList: [], //日程状态
                scheduleStatus: [], //日程状态-选择的
                theirSalesIndeter: false,
                theirSalesAll: true,  //所属销售-全部
                theirSalesList: [], //所属销售
                theirSales: [], //所属销售-选择的
                scheduleList: [],   //日程列表
                selectTab: '我的日程',
                today: this.comm.formatDate(new Date(), 'yyyy-MM-dd'),
                selectDate: this.comm.formatDate(new Date(), 'yyyy-MM-dd'),  //选择的日期
                prevYear: new Date().getFullYear(),
                prevMonth: new Date().getMonth() + 1,
                isScheduleDialog: false,
                dialogScheduleTitle: '',
                updateSchedule: 0
            }
        },
        components: {
            VTop,
            VSchedule,
            VScheduleDialog
        },
        mounted() {
            this.getSchedule(this.comm.formatDate(new Date(), 'yyyy-MM')).then((res) => {
                this.createCalendar(new Date().getFullYear(), new Date().getMonth() + 1, "current-calendar");
                this.selcetSchedule();
            });
        },
        methods: {
            changeScheduleTab(v) {
                if(v === '我的日程') {
                    this.filterStatus = false;
                }
                this.updateSchedule++;
                this.selectDate = this.comm.formatDate(new Date, 'yyyy-MM-dd'),  //选择的日期
                this.prevYear = new Date().getFullYear(),
                this.prevMonth = new Date().getMonth() + 1,
                this.getSchedule(this.comm.formatDate(new Date(), 'yyyy-MM')).then((res) => {
                    this.createCalendar(new Date().getFullYear(), new Date().getMonth() + 1, "current-calendar");
                    this.selcetSchedule();
                });
            },
            filterCondition() {
                this.filterStatus = !this.filterStatus;
                if(this.filterStatus) {
                    Promise.all([
                        this.$store.dispatch('getTypeData', '日程狀態'),
                        this.$store.dispatch('getTeamMembers')
                    ]).then(() => {
                        this.scheduleStatusList = this.$store.state.scheduleStatusList;
                        // this.scheduleStatus = this.$store.state.scheduleStatusList;
                        this.theirSalesList = this.$store.state.teamMembersList;
                        // this.theirSales = this.$store.state.teamMembersList;
                    })
                }
            },
            //日程状态-全部
            checkScheduleStatusAll(v) {
                // this.scheduleStatus = v ? this.scheduleStatusList : [];
                // this.scheduleStatusIndeter = false;
                this.scheduleStatus = [];
            },
            //日程状态-单选
            checkScheduleStatus(v) {
                // let checkedCount = v.length;
                // this.scheduleStatusAll = checkedCount === this.scheduleStatusList.length;
                // this.scheduleStatusIndeter = checkedCount > 0 && checkedCount < this.scheduleStatusList.length;
                this.scheduleStatusAll = false;
            },
            //所属销售-全部
            checkTheirSalesAll(v) {
                // this.theirSales = v ? this.theirSalesList : [];
                // this.theirSalesIndeter = false;
                this.theirSales = [];
            },
            //所属销售-单选
            checkTheirSales(v) {
                // let checkedCount = v.length;
                // this.theirSalesAll = checkedCount === this.theirSalesList.length;
                // this.theirSalesIndeter = checkedCount > 0 && checkedCount < this.theirSalesList.length;
                this.theirSalesAll = false;
            },
            //查詢
            queryData() {
                this.updateSchedule++;
            },
            //重置
            resetForm() {
                this.scheduleStatusAll = true;
                this.checkScheduleStatusAll(true);
                this.theirSalesAll = true;
                this.checkTheirSalesAll(true);
                this.keywords = '';
            },
            //回到今天
            toDay() {
                this.updateSchedule++;
                this.selectDate = this.today;
                this.getSchedule(this.comm.formatDate(new Date(), 'yyyy-MM')).then((res) => {
                    this.createCalendar(new Date().getFullYear(), new Date().getMonth() + 1, "current-calendar");
                    this.selcetSchedule();
                });
            },
            //刷新日程数据
            refreshSchedule() {
                this.getSchedule(this.comm.formatDate(new Date(this.prevYear + '-' + this.prevMonth), 'yyyy-MM')).then((res) => {
                    this.createCalendar(this.prevYear, this.prevMonth, "current-calendar");
                    this.selcetSchedule();
                });
            },
            //日历
            createCalendar(c_Y, c_M, el) {
                let $this = this;
                var scheduleList  = this.scheduleList;
                var hasFestival = ""; //当天是否有节日
                //公历节日
                var gregorianFestivals = {
                    '0101': '元旦',
                    '0214': '情人节',
                    '0308': '妇女节',
                    '0312': '植树节',
                    '0401': '愚人节',
                    '0501': '劳动节',
                    '0504': '青年节',
                    '0512': '护士节',
                    '0601': '儿童节',
                    '0701': '建党节',
                    '0801': '建军节',
                    '0910': '教师节',
                    '1001': '国庆节',
                    '1224': '平安夜',
                    '1225': '圣诞节',
                };

                var lunarFestivals = {
                    '腊月三十': '除夕',
                    '正月初一': '春节',
                    '正月十五': '元宵节',
                    '五月初五': '端午节',
                    '七月初七': '七夕节',
                    '八月十五': '中秋节',
                    '九月初九': '重阳节',
                };
                var dateObj = (function(){
                    var _date = new Date();    // 默认为当前系统时间
                    return {
                        getDate : function(){
                            return _date;
                        },
                        setDate : function(date) {
                            _date = date;
                        }
                    };
                })();
                //设置calendar div中的html部分
                renderHtml();
                //表格中显示日期
                showCalendarData(c_Y, c_M,scheduleList);
                /**
                 * 渲染html结构
                 */
                function renderHtml() {
                
                    //设置表格区的html结构
                    var _headHtml = "<tr>" + 
                                "<th>日</th>" +
                                "<th>一</th>" +
                                "<th>二</th>" +
                                "<th>三</th>" +
                                "<th>四</th>" +
                                "<th>五</th>" +
                                "<th>六</th>" +
                            "</tr>";
                    var _bodyHtml = "";
                
                    // 一个月最多31天，所以一个月最多占6行表格
                    for(var i = 0; i < 6; i++) {  
                        _bodyHtml += "<tr>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                            "</tr>";
                    }
                    var innerHTML = "<table id='" + el + "' class='calendar-table'>" +
                                _headHtml + _bodyHtml +
                                "</table>";
                    // 添加到calendar div中
                    $("#" + el).html(innerHTML)
                }
                /**
                 * 表格中显示数据，并设置类名
                 */
                function showCalendarData(c_Y, c_M, scheduleList) {
                    var _year = c_Y;
                    var _month = c_M;
                    var _dateStr = getDateStr(dateObj.getDate());
                
                    // 设置表格中的日期数据
                    var _table = document.getElementById(el);
                    var _tds = _table.getElementsByTagName("td");
                    var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
                    var splitArr = $this.selectDate.split('-');
                    for(var i = 0; i < _tds.length; i++) {
                        var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
                        var _thisDayStr = getDateStr(_thisDay);
                        var lunarFestival = festivalView(getLunarCalendar(i + 1 - _firstDay.getDay()), _month, i + 1 - _firstDay.getDay())
                        _tds[i].innerHTML = '<div class="day">' + _thisDay.getDate() + '</div><div class="festival">' + lunarFestival + '</div>';
                        _tds[i].setAttribute('data', _thisDayStr);
                        _tds[i].setAttribute('data-date', getDateWeird(_thisDay));
                        if(_thisDayStr == getDateStr(new Date()) && _thisDayStr == splitArr.join('') && _month == Number(splitArr[1])) {    // 当前天
                            _tds[i].className = 'cur-month cur';
                        } else if(_thisDayStr == splitArr.join('') && _month == Number(splitArr[1])) {
                            _tds[i].className = 'cur-month cur';
                        } else if(_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
                            _tds[i].className = 'cur-month';  // 当前月
                        }else {    // 其他月
                            _tds[i].className = 'ago';
                        }
                        for(var j = 0; j < scheduleList.length; j++) {
                            if((scheduleList[j].ScheduleDate.replace(/\-/g, "") == _thisDayStr && _thisDayStr == getDateStr(new Date())) || (scheduleList[j].ScheduleDate.replace(/\-/g, "") == _thisDayStr && (_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)))) {
                                _tds[i].className += ' tag';
                                var lunarFestival = festivalView(getLunarCalendar(i + 1 - _firstDay.getDay()), _month, i + 1 - _firstDay.getDay())
                                _tds[i].innerHTML = '<div class="day">' + _thisDay.getDate() + '</div><div class="festival">' + lunarFestival + '</div>' + '<i></i>';
                            }
                        }
                    }
                }
                /**
                 * 日期转化为字符串， 4位年+2位月+2位日
                 */
                function getDateStr(date) {
                    var _year = date.getFullYear();
                    var _month = date.getMonth() + 1;    // 月从0开始计数
                    var _d = date.getDate();
                    
                    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
                    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
                    return _year + _month + _d;
                }

                function getDateWeird(date) {
                    var _year = date.getFullYear();
                    var _month = date.getMonth() + 1;    // 月从0开始计数
                    var _d = date.getDate();
                    
                    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
                    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
                    return _year + '-' + _month + '-' + _d;
                }

                /**
                 * 获取农历
                 */
                function getLunarCalendar(date) {
                    let detail = $this.dateDetail({
                        'timeStamp': new Date($this.prevYear, $this.prevMonth - 1, date).getTime()
                    }).aL.lunarCalendar;
                    // console.log(detail)
                    return detail
                }

                /**
                 * 获取当日是否是农历假日
                 */
                function festivalView(lunarCalendar, month, date) {
                    if (Object.keys(lunarFestivals).indexOf(lunarCalendar) != -1) {
                        hasFestival = lunarFestivals[lunarCalendar]
                        return lunarFestivals[lunarCalendar]
                    } else {
                        let day = (month > 9 ? month + '' : "0" + month) + (date > 9 ? date + '' : "0" + date);
                        if (Object.keys(gregorianFestivals).indexOf(day) != -1) {
                            hasFestival = gregorianFestivals[day]
                            return gregorianFestivals[day]
                        } else {
                            if (lunarCalendar.indexOf('闰') != -1) {
                                return lunarCalendar.slice(5, 7);
                            } else {
                                return lunarCalendar.slice(2, 4);
                            }
                        }
                    }
                }
            },
            //上一个
            prevDate() {
                let $this = this;
                $this.prevMonth = $this.prevMonth - 1;
                if($this.prevMonth <= 0) {
                    $this.prevYear = $this.prevYear - 1;
                    $this.prevMonth = 12;
                }
                $this.getSchedule($this.comm.formatDate(new Date($this.prevYear + '-' + $this.prevMonth), 'yyyy-MM')).then((res) => {
                    $this.createCalendar($this.prevYear, $this.prevMonth, "current-calendar");
                    $this.selcetSchedule();
                });
            },
            //下一个
            nextDate() {
                let $this = this;
                $this.prevMonth = $this.prevMonth + 1;
                if($this.prevMonth > 12) {
                    $this.prevYear = $this.prevYear + 1;
                    $this.prevMonth = 1;
                }
                $this.getSchedule($this.comm.formatDate(new Date($this.prevYear + '-' + $this.prevMonth), 'yyyy-MM')).then(() => {
                    $this.createCalendar($this.prevYear, $this.prevMonth, "current-calendar");
                    $this.selcetSchedule();
                });
            },
            //获取日程安排
            getSchedule(date) {
                return new Promise((resolve, reject) => {
                    let url = '';
                    if(this.selectTab === '我的日程') {
                        url = '/api/BasicsApi/GetCalendarByMonth';
                    } else if(this.selectTab === '下屬日程') {
                        url = '/api/BasicsApi/GetTeamCalendarByMonth';
                    }
                    this.$post(url, { CurMonth: date })
                    .then((res) => {
                        this.scheduleList = res.Info;
                        resolve('ok');
                    })
                    .catch(err => {

                    });
                });
            },
            //选择日程安排
            selcetSchedule() {
                let $this = this;
                $('.calendar-table').on('click', '.cur-month', function() {
                    if($(this).closest('.calendar-table').find('td').hasClass('cur')) {
                        $(this).closest('.calendar-table').find('td').removeClass('cur');
                    }
                    if(!$(this).closest('.calendar-table').find('td').hasClass('ago')) {
                        $(this).closest('.calendar-table').find('td').addClass('cur-month');
                    }
                    $(this).addClass('cur');
                    $this.updateSchedule++;
                    $this.selectDate = $(this).attr("data-date");
                });
            },
            //新建日程弹框-显示
            showScheduleDialog(str){
                this.dialogScheduleTitle = str;
                this.isScheduleDialog = true;
            },
            //新建日程弹框-隐藏
            hideScheduleDialog(v){
                if(v) {
                    this.getSchedule(this.comm.formatDate(new Date(), 'yyyy-MM')).then((res) => {
                        this.createCalendar(new Date().getFullYear(), new Date().getMonth() + 1, "current-calendar");
                        this.selcetSchedule();
                    });
                }
                this.updateSchedule++;
                this.isScheduleDialog = false;
            },
            dateDetail(obj) {
                var sWeek = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
                var weekEng = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                var dNow = new Date();
                var CalendarData = new Array(100);
                var madd = new Array(12);
                var tgString = "甲乙丙丁戊己庚辛壬癸";
                var dzString = "子丑寅卯辰巳午未申酉戌亥";
                var numString = "一二三四五六七八九十";
                var monString = "正二三四五六七八九十冬腊";
                var weekString = "日一二三四五六";
                var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
                var cYear, cMonth, cDay, TheDate;
                CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B,
                    0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F,
                    0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
                madd[0] = 0;
                madd[1] = 31;
                madd[2] = 59;
                madd[3] = 90;
                madd[4] = 120;
                madd[5] = 151;
                madd[6] = 181;
                madd[7] = 212;
                madd[8] = 243;
                madd[9] = 273;
                madd[10] = 304;
                madd[11] = 334;

                function GetBit(m, n) {
                    return (m >> n) & 1;
                }

                function e2c() {
                    TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
                    var total, m, n, k;
                    var isEnd = false;
                    var tmp = TheDate.getFullYear();
                    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
                    if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
                        total++;
                    }
                    for (m = 0; ; m++) {
                        k = (CalendarData[m] < 0xfff) ? 11 : 12;
                        for (n = k; n >= 0; n--) {
                            if (total <= 29 + GetBit(CalendarData[m], n)) {
                                isEnd = true;
                                break;
                            }
                            total = total - 29 - GetBit(CalendarData[m], n);
                        }
                        if (isEnd) break;
                    }
                    cYear = 1921 + m;
                    cMonth = k - n + 1;
                    cDay = total;
                    if (k == 12) {
                        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                            cMonth = 1 - cMonth;
                        }
                        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                            cMonth--;
                        }
                    }
                }

                var annals = "";

                /**
                 * 计算纪年 农历
                 */
                function GetcDateString() {
                    var tmp = "";
                    if (cMonth < 1) {
                        tmp += "(闰)";
                        tmp += monString.charAt(-cMonth - 1);
                    } else {
                        tmp += monString.charAt(cMonth - 1);
                    }
                    tmp += "月";
                    tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay == 20)?"二十" : ((cDay < 30) ? "廿" : "三十")));
                    if (cDay % 10 != 0 || cDay == 10) {
                        tmp += numString.charAt((cDay - 1) % 10);
                    }
                    return {
                        annals: tgString.charAt((cYear - 4) % 10) + dzString.charAt((cYear - 4) % 12) + '年',
                        lunarCalendar: tmp
                    }
                }

                function GetLunarDay(solarYear, solarMonth, solarDay) {
                    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                    e2c(solarYear, solarMonth, solarDay);
                    return GetcDateString();
                }

                var D = new Date();
                var yy = D.getFullYear();
                var mm = D.getMonth() + 1;
                var dd = D.getDate();
                var ww = D.getDay();
                var ss = parseInt(D.getTime() / 1000);

                function getFullYear(d) {// 修正firefox下year错误
                    var yr = d.getYear();
                    if (yr < 1000)
                    yr += 1900;
                    return yr;
                }

                if (obj.timeStamp) {
                    dNow = new Date(obj.timeStamp);
                }
                let lunarDay = GetLunarDay(getFullYear(dNow), dNow.getMonth() + 1, dNow.getDate());
                return {
                    year: getFullYear(dNow),
                    month: dNow.getMonth() + 1,
                    date: dNow.getDate(),
                    week: sWeek[dNow.getDay()], //星期
                    weekEng: weekEng[dNow.getDay()], //星期英文
                    aL: lunarDay,  //annals：纪年   lunarCalendar：农历
                    dayDetail: getFullYear(dNow) + "年" + (dNow.getMonth() + 1) + "月" + dNow.getDate() + "日" + " " + sWeek[dNow.getDay()] + " " + lunarDay.annals + " " + lunarDay.lunarCalendar
                }
            }
        }
    }
</script>

<style scoped>
    .calendar-box {
        padding: 10px;
        height: 510px;
        overflow: hidden;
        background-color: #ffffff;
    }
    .calendar-box .calendar-head {
        margin-bottom: 10px;
        height: 30px;
        text-align: center;
    }
    .calendar-box .calendar-head .title {
        display: inline-block;
        margin: 0 20px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
    }
    .calendar-box .calendar-head .el-icon-arrow-left,
    .calendar-box .calendar-head .el-icon-arrow-right {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        font-weight: bold;
    }
    .schedule-box {
        padding: 30px 15px;
        background-color: #ffffff;
    }
    .schedule-box .schedule-head {
        margin-bottom: 20px;
        font-size: 18px;
        color: #ee3a43;
    }
</style>

<style>
    .calendar-table {
        width: 100%;
        border-collapse: collapse;
    }
    .calendar-table th, .calendar-table td {
        padding: 20px 0;
        width: 14.1%;
        font-size: 16px;
        color: #616161;
        text-align: center;
        vertical-align: middle;
    }
    .calendar-table .cur-month {
        cursor: pointer;
    }
    .calendar-table .cur {
        color: #ffffff;
        background: #ee3a43;
    }
    .calendar-table .ago {
        color: #ffffff;
    }
    .calendar-table .tag {
        position: relative;
    }
    .calendar-table .tag i {
        position: absolute;
        top: 37px;
        left: 50%;
        margin-left: -3px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #ee3a43;
    }
    .calendar-table .cur.tag i {
        background-color: #ffffff;
    }
    .calendar-table .day {
        margin-bottom: 5px;
    }
    .calendar-table .festival {
        font-size: 12px;
    }
    .to-day {
        margin-left: 20px;
        font-size: 14px;
        color: #0099FF;
        cursor: pointer;
    }
</style>
