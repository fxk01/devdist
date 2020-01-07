export const mixin = {
  data() {
    return {
      codeDisabled: false,
      countdown: 120,
      codeMsg: '获取验证码',
      timer: null
    }
  },
  methods: {
    /*
     发送验证码
     */
    sendVerificationCode() {
      this.codeDisabled = true;
      this.timer = setInterval(() => {
        if (this.countdown > 0 && this.countdown <= 120) {
          this.countdown--;
          if (this.countdown !== 0) {
            this.codeMsg = '重新发送(' + this.countdown + ')';
          } else {
            clearInterval(this.timer);
            this.codeMsg = '获取验证码';
            this.countdown = 120;
            this.timer = null;
            this.codeDisabled = false;
          }
        }
      }, 1000)
    },
    deBounce(fn, delay) {
      let args = arguments,
        context = this,
        timer = null;

      return function () {
        if (timer) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            fn.apply(context, args);
          }, delay);
        } else {
          timer = setTimeout(function () {
            fn.apply(context, args);
          }, delay);
        }
      }
    },
    isOwnEmpty(obj) {
      for(let name in obj) {
        if(obj.hasOwnProperty(name)) {
          return false;
        }
      }
      return true;
    },
    parseURL(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return " ";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    fmtDate(obj) {
      let now = obj === undefined ? new Date() : new Date(obj),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    },
    getFmtDate() {
      let now = new Date(),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
      return y + '.' + (m < 10 ? '0' + m : m) + '.' + '01' + '-' + y + '.' + (m < 10 ? '0' + m : m) + '.' + (d < 10 ? '0' + d : d);
    },
    clone(obj) {
      if(obj === null) return null;
      if(typeof obj !== 'object') return obj;
      if(obj.constructor === Date) return new Date(obj);
      let newObj = new obj.constructor ();  //保持继承链
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {   //不遍历其原型链上的属性
          let val = obj[key];
          newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
        }
      }
      return newObj;
    },
    copyArr(obj) {
      let clonedObj;
      // 判断直接数据类型
      if (['number', 'string', 'boolean', 'undefined', 'symbol',].includes(typeof obj)
        || obj === null) {
        clonedObj = obj;
        return clonedObj;
      }

      const constructor = obj.constructor || Object;
      clonedObj = new constructor();

      Object.entries(obj).forEach(([key, value]) => {
        clonedObj[key] = this.copyArr(value);
      });

      return clonedObj;
    },
    hkDateFuc(date, type) {
      if(date) {
        let now = date,
          y = now.getFullYear(),
          m = now.getMonth() + 1,
          d = now.getDate();
        switch(type) {
          case 'dateHM':
            return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.getHours() + ':' + now.getMinutes();
          case 'dateEndHM':
            return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + parseInt(now.getHours() + 1) + ':' + now.getMinutes();
          default:
            // return day + '/' + month + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds;
        }
      }
    }
  }
};