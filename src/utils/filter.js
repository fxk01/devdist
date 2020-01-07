// 全局过滤器
import Vue from 'vue';

//香港时间格式化（type=date是获取日月年，type=dateHM是获取日月年时分，其它是获取日月年时分秒）
Vue.filter('hkDate', function(date, type = '', mode = '/') {
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
            case 'HM':
                return hour + ':' + minutes;
            case 'MD':
                return month + mode + day + ' ' + hour + ':' + minutes;
            break;
            default:
                return day + mode + month + mode + year + ' ' + hour + ':' + minutes + ':' + seconds;
            break;
        }
    }
});

//金额大写
Vue.filter('moneyUpper', function(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
        return "";
    }
    var unit = "仟佰拾億仟佰拾萬仟佰拾元角分", str = "";
        n += "00";
    var p = n.indexOf('.');
    if (p >= 0) {
        n = n.substring(0, p) + n.substr(p+1, 2);
    }
    unit = unit.substr(unit.length - n.length);
    for (var i=0; i < n.length; i++) {
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    }
    if(n > 0) {
        return (str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(萬|億|元)/g, "$1").replace(/(億)萬|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"))
    }
});

//字符串超出限制长度，以省略号补充（len为限制长度）
Vue.filter('subString', function(vaule, len) {
    let str = vaule;
    if(str && str.length > len) {
        str = str.substring(0, len) + '…';
    }
    return str;
});

//金额千分位两位小数点
Vue.filter('thousandth', function(value, len) {
    let str = value;
    return str.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
});

//传过来的字符串为空时，默认返回-
Vue.filter('returnStr', function(str, type = '-') {
    if(str) {
        return str;
    } else {
        return type;
    }
})