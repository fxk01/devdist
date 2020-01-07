import Vue from 'vue';
import ElementUI from 'element-ui';
import Viewer from 'viewerjs';
import { CryptoJS } from './aes'

export default {
    //tab标签关闭
    commColseRouter() {
        $("#tagsNav .tags-li").each(function(index){
            if($(this).hasClass("active")){
                $(this).find(".el-icon-close").click();
            }
        });
    },
    //刷新数据
    commRefreshData(el, time = 1000) {
        let loading = el.$loading({
            text: '加载中...'
            //spinner: 'el-icon-loading',
            //background: 'rgba(0, 0, 0, 0.6)'
        });
        setTimeout(() => {
            loading.close();
        }, time);
    },
    //验证空格
    commVerifyBlank(rule, value, callback) {
        if (!$.trim(value)) {
            callback(new Error('請輸入正確的格式'));
        } else {
            callback();
        }
    },
    //验证是否是非数字值
    commVerifyInteger(rule, value, callback) {
        if (isNaN(value)) {
            callback(new Error('請輸入正確的格式'));
        } else {
            callback();
        }
    },
    //验证数值(正数、负数、小数)
    commVerifyNumber(rule, value, callback) {
        let regex = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!regex.test(value)) {
            callback(new Error('請輸入正確的格式'));
        } else {
            callback();
        }
    },
    //验证金额不能小于或等于零
    commIsZero(rule, value, callback) {
        let regex = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!regex.test(value) || value <= 0) {
            callback(new Error('請輸入正確的金額'));
        } else {
            callback();
        }
    },
    //天数加减年、季度、月、日、时、分、秒
    commDateModified(interval, number, date, modified) {
        switch(modified) {
            case '+': {
                switch(interval) {
                    case "yeart": {
                        date.setFullYear(date.getFullYear() + number);
                        return date;
                        break;
                    }
                    case "quarter": {
                        date.setMonth(date.getMonth() + number * 3);
                        return date;
                        break;
                    }
                    case "month": {
                        date.setMonth(date.getMonth() + number);
                        return date;
                        break;
                    }
                    case "week": {
                        date.setDate(date.getDate() + number * 7);
                        return date;
                        break;
                    }
                    case "day": {
                        date.setDate(date.getDate() + number);
                        return date;
                        break;
                    }
                    case "hour": {
                        date.setHours(date.getHours() + number);
                        return date;
                        break;
                    }
                    case "minute": {
                        date.setMinutes(date.getMinutes() + number);
                        return date;
                        break;
                    }
                    case "second": {
                        date.setSeconds(date.getSeconds() + number);
                        return date;
                        break;
                    }
                    default: {
                        date.setDate(date.getDate());
                        return date;
                        break;
                    }
                }
            }
            case '-': {
                switch(interval) {
                    case "yeart": {
                        date.setFullYear(date.getFullYear() - number);
                        return date;
                        break;
                    }
                    case "quarter": {
                        date.setMonth(date.getMonth() - number * 3);
                        return date;
                        break;
                    }
                    case "month": {
                        date.setMonth(date.getMonth() - number);
                        return date;
                        break;
                    }
                    case "week": {
                        date.setDate(date.getDate() - number * 7);
                        return date;
                        break;
                    }
                    case "day": {
                        date.setDate(date.getDate() - number);
                        return date;
                        break;
                    }
                    case "hour": {
                        date.setHours(date.getHours() - number);
                        return date;
                        break;
                    }
                    case "minute": {
                        date.setMinutes(date.getMinutes() - number);
                        return date;
                        break;
                    }
                    case "second": {
                        date.setSeconds(date.getSeconds() - number);
                        return date;
                        break;
                    }
                    default: {
                        date.setDate(date.getDate());
                        return date;
                        break;
                    }
                }
            }
        }
    },
    //登录签名已过期，请重新登录
    commReturnLogin(el) {
        var $this = el;
        $this.$message({
            message: '登录签名已过期，请重新登录',
            type: 'warning',
            showClose: true,
            onClose: function() {
                sessionStorage.removeItem('fc_username')
                $this.$router.push('/login');
            }
        });
    },
    //查看图片
    isLookPh(img){
        const ViewerDom = document.getElementsByClassName(img)[0];
        const viewer = new Viewer(ViewerDom, {
            // 配置
            initialViewIndex:0,
            button:false,
            navbar:true,
            movable:true,
            zoomable:true,
            rotatable:true,
            scalable:true,
            zIndex: 99999999
        })
    },
    //金额千分位分割（number：金额、decimals：保留小数点位数，默认为0、decPoint：小数点符号默认为.、thousandsSep：千分位分割符号默认为,）
    formatMoney(number, decimals = 0, decPoint = '.', thousandsSep = ',') {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '')
        let n = !isFinite(+number) ? 0 : +number
        let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
        let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
        let s = ''
        let toFixedFix = function (n, prec) {
          let k = Math.pow(10, prec)
          return '' + Math.ceil(n * k) / k
        }
        // s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
        s = (prec ? toFixedFix(n, prec) : '' + n).split('.')
        let re = /(-?\d+)(\d{3})/
        while (re.test(s[0])) {
          s[0] = s[0].replace(re, '$1' + sep + '$2')
        }
        if ((s[1] || '').length < prec) {
          s[1] = s[1] || ''
          s[1] += new Array(prec - s[1].length + 1).join('0')
        }
        return s.join(dec)
    },
    //图片basc64转文件
    switchImgFile(bascImg){
        let dataurl = bascImg;
        let filename = 'file';
        let arr = dataurl.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split('/')[1];
        let bstr = atob(arr[1]);
        let m = bstr.length;
        let u8arr = new Uint8Array(m);
        while (m--) {
            u8arr[m] = bstr.charCodeAt(m);
        }
        return new File([u8arr], `${filename}.${suffix}`, {type: mime});
    },
    switchImgFileOther(bascImg, fileName){
        let dataurl = bascImg;
        let filename = fileName;
        let arr = dataurl.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split('/')[1];
        let bstr = atob(arr[1]);
        let m = bstr.length;
        let u8arr = new Uint8Array(m);
        while (m--) {
            u8arr[m] = bstr.charCodeAt(m);
        }
        return new File([u8arr], `${filename}`, {type: mime});
    },
    // 當前時間轉爲指定格式
    dealWithTime (str, type = '') {
        if(!str) return '';
        let formatDateTime
        let data = new Date(str);
        let Y = data.getFullYear()
        let M = data.getMonth() + 1
        let D = data.getDate()
        let H = data.getHours()
        let Min = data.getMinutes()
        let S = data.getSeconds()
        let W = data.getDay()
        H = H < 10 ? ('0' + H) : H
        Min = Min < 10 ? ('0' + Min) : Min
        S = S < 10 ? ('0' + S) : S
        switch (W) {
            case 0:
            W = '天'
            break
            case 1:
            W = '一'
            break
            case 2:
            W = '二'
            break
            case 3:
            W = '三'
            break
            case 4:
            W = '四'
            break
            case 5:
            W = '五'
            break
            case 6:
            W = '六'
            break
            default:
            break
        }
        if(str.indexOf('0001-01-01') != -1) {
            formatDateTime = '';
        } else {
            switch(type) {
                case 'date': 
                    formatDateTime = Y + '年' + M + '月' + D + '日 '
                break;
                default: 
                formatDateTime = Y + '年' + M + '月' + D + '日 ' + H + ':' + Min + ':' + S + ' 星期' + W
            }
            
        }
        return formatDateTime
    },
    // 獲取以前日期
    getDateTime (beforeTime) {
        let startTime = ''
        let date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * beforeTime)
        let month = date.getMonth() + 1
        month < 10 ? month = '0' + month : ''
        let day = date.getDate()
        day < 10 ? day = '0' + day : ''
        startTime = date.getFullYear() + '-' + month + '-' + day
        return startTime
    },
    // 獲取當前日期
    getNowDate () {
        let endTime = ''
        let date2 = new Date()
        let month1 = date2.getMonth() + 1
        month1 < 10 ? month1 = '0' + month1 : ''
        let day2 = date2.getDate()
        day2 < 10 ? day2 = '0' + day2 : ''
        endTime = date2.getFullYear() + '-' + month1 + '-' + day2
        return endTime
    },
    //转换日期时间
    getHkDate(date, type = '', mode = '/') {
        if(date){
            let d = date;
            let Arr = d.split(/[T ]/);
            let dateArr = Arr[0].split(/[-/]/);
            let timeArr = Arr[1].split(':');
            let year = dateArr[0];
            let month = dateArr[1];
            let day = dateArr[2];
            let hour = timeArr[0];
            let minutes = timeArr[1];
            let seconds = timeArr[2];
            if(year=='0001'){
                return ''
            }
            switch(type) {
                case 'date':
                    return day + mode + month + mode + year;
                break;
                case 'dateHM':
                    return day + mode + month + mode + year + ' ' + hour + ':' + minutes;
                break;
                default:
                    return day + mode + month + mode + year + ' ' + hour + ':' + minutes + ':' + seconds;
                break;
            }
        }
    },
    //加密
    commEncrypt(word, key) {
        var key = CryptoJS.enc.Utf8.parse(key); //32位
        var iv = CryptoJS.enc.Utf8.parse("1234567890000000");//16位
        var encrypted = '';
        if (typeof (word) == 'string') {
            var srcs = CryptoJS.enc.Utf8.parse(word);
            encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        } else if (typeof (word) == 'object') {//对象格式的转成json字符串
            data = JSON.stringify(word);
            var srcs = CryptoJS.enc.Utf8.parse(data);
            encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
        }
        return encrypted.ciphertext.toString();
    },
    // 设置银行账号4位空格
    setBankNoTrim (bankNo) {
        return bankNo.replace(/\s/g,'').replace(/[^\d|[A-Za-z]]/g,'').replace(/((\d|[A-Za-z]){4})(?=\d)/g,'$1 ')
    },
    // 限制文本框-文本框只能输入数值两位小数
    restrictMoney(e) {
        return (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
    },
    // 限制文本框-只能输入中文、英文、空格
    restrictChineseAndEnglish(e) {
        return (e.match(/^[\u4e00-\u9fa5A-Za-z ]*/g)[0]) || null;
    },
    // 格式化日期时间
    formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
            }
        }
        return fmt;
    }
}