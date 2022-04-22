function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getYMD (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function getHM (date) {
  var hour = date.getHours()
  var minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

function getW (date) {
  var d = date.getDay();
  var arr = ['日', '一', '二', '三', '四', '五', '六'];

  return '星期' + arr[d];
}
// 补零
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 验证手机号码
var Verification = (function(){
  var reg = {
    phone: /^1(3|4|5|7|8)\d{9}$/,                           // 手机号
    email: /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/,                // 邮箱
    Ftrim: /^\s+|\s+$/gm,                                    // 前后空格
    special: /^[\u4e00-\u9fa5]+$/g,                          // 只匹中文字符
    money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/  // 钱
  }
  return reg;
}());

// 删除本地的Storage
var removeStorage = function (key) {         
    wx.removeStorage({            
        key: key,
        success: function (res) {
        }
    })
};
// 添加本地的Storage
var setStorage = function (key,val){
    wx.setStorage({                      
        key: key,
        data: val
    })
};

// 提示框
var showModal = function(title,text){
    if(arguments.length == 1) {
        text = arguments[0];
        title = null;
    }
    wx.showModal({
        title: title || "提示" ,
        showCancel: false,
        content: text
    });
}

// 配置域名
var url = (function(){
    return "xxx"
}());

// 弹出层，关于全部的页面，跳转
var reLaunch = function (test, url){
    wx.showModal({
        title: '提示',
        content: test,
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                wx.reLaunch({
                    url: url
                })
            }
        }
    })
}


/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
function formatRichText(html){
    let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
        return match;
    });
    newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
        match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
        return match;
    });
    newContent = newContent.replace(/<br[^>]*\/>/gi, '');
    newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
    return newContent;
}
 
function replaceUP  (str) {
    return str.replace('Up', 'upload');
}


// 公共的接口方法
var requestFn = function (josn){
    wx.request({
        url: url + josn.url, 
        data: josn.data,
        method: josn.method || 'GET' ,
        header: {
            'content-type': 'application/json'
        },
        success: josn.success || null,
        fail:  josn.fail || null,
        complete:josn.complete || null
    })
}

export default class Util {
  /* 将wx的回调函数转换成Promise */
  static promisic() {
    let qx = {}
    // 特别指定的wx对象中不进行Promise封装的方法
    const noPromiseMethods = {
      clearStorage: 1,
      hideToast: 1,
      showNavigationBarLoading: 1,
      hideNavigationBarLoading: 1,
      drawCanvas: 1,
      canvasToTempFilePath: 1,
      hideKeyboard: 1,
    }
    // 对wx的每个方法进行封装
    Object.keys(wx).forEach((key) => {
      if (
        noPromiseMethods[key]                        // 特别指定的方法
        || /^(on|create|stop|pause|close)/.test(key) // 以on* create* stop* pause* close* 开头的方法
        || /\w+Sync$/.test(key)                      // 以Sync结尾的方法
      ) {
        // 不进行Promise封装
        qx[key] = function () {
          if (__DEV__) {
            let res = wx[key].apply(wx, arguments)
            if (!res) {
              res = {}
            }
            if (res && typeof res === 'object') {
              res.then = () => {
                console.warn('wx.' + key + ' is not a async function, you should not use await ')
              }
            }
            return res
          }
          return wx[key].apply(wx, arguments)
        }
        return
      }
      // 其余方法自动Promise化
      qx[key] = function (obj) {
        obj = obj || {}
        return new Promise((resolve, reject) => {
          obj.success = resolve
          obj.fail = (res) => {
            if (res && res.errMsg) {
              reject(new Error(res.errMsg))
            } else {
              reject(res)
            }
          }
          wx[key](obj)
        })
      }
    })
    return qx
  }

  /* 模态弹窗 */
  static showModal(options) {
    let defaultOption = {
      title: '提示',
      content: '',
      confirmText: '确定',
      cancelText: '取消'
    }
    options = Object.assign(defaultOption, options || {})
    return new Promise(function (resolve, reject) {
      wx.showModal({
        title: options.title,
        content: options.content,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        success: function (res) {
          if (res.confirm) {
            resolve('模态弹窗确定!')
          } else {
            reject('模态弹窗取消!')
          }
        }
      })
    })
  }

  /* 保存搜索历史记录 */
  static saveSearchHistory({ searchType = '1', keyword }) {
    if (!keyword) return
    let searchHistroy = wx.getStorageSync(searchText[searchType])
    try {
      searchHistroy = JSON.parse(searchHistroy)
    } catch (e) {
      searchHistroy = []
    }
    if (searchHistroy.filter(x => x.keyword = keyword).length > 0) return
    let guid = this.genId(6)
    searchHistroy.push({ guid: guid, keyword: keyword })
    searchHistroy = JSON.stringify(searchHistroy)
    wx.setStorageSync(searchText[searchType], searchHistroy)
  }

  /* 获取用户所有信息 */
  static getFullUserInfo() {
    const app = getApp()
    return new Promise((resolve, reject) => {
      if (app.globalData.userInfo) {
        resolve(app.globalData.userInfo)
        return
      }
      app.userModel.getFullUserInfo().then(res => {
        app.globalData.userInfo = res.data
        resolve(app.globalData.userInfo)
      }, () => { reject() })
    })
  }

  /* 获取搜索历史记录 */
  static getSearchHistory(searchType = '1') {
    let searchHistroy = wx.getStorageSync(searchText[searchType])
    if (searchHistroy) {
      return JSON.parse(searchHistroy)
    } else {
      return []
    }
  }

  /* 删除单个搜索记录 */
  static removeSearchHistory({ searchType = '1', guid }) {
    if (!guid) return
    let searchHistroy = JSON.parse(wx.getStorageSync(searchText[searchType]))
    searchHistroy = searchHistroy.filter(x => x.guid != guid)
    wx.setStorageSync(searchText[searchType], JSON.stringify(searchHistroy))
  }

  /* 清除所有搜索历史 */
  static clearSearchHistory(searchType = '1') {
    wx.removeStorageSync(searchText[searchType])
  }

  /* 生成guid */
  static genId(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
  }

  /* 验证是否微信授权 */
  static checkIsAuthorized(e) {
    const app = getApp()
    let { user_type } = app.globalData.userInfo
    if (user_type == "1" || user_type == "2") return 2
    let userInfo = e.detail.userInfo
    if (!userInfo) return 0
    else return 1
  }

  /* 正则匹配 */
  static regex(str, type) {
    switch (type) {
      case 'email':
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str);
      case 'mobile':
        return /^(17[0-9]|13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|4|5|6|7|8|9])\d{8}$/.test(str);
      case 'phone':
        return /\d{3}-\d{8}|\d{4}-\d{7}/.test(str);
      case 'username':
        return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(str); //字母开头，允许5-16字节，允许字母数字下划线
      case 'password':
        return /^\w{6,20}$/.test(str); //字母开头，长度在6-20之间，只能包含字母、数字、下划线
      case 'nickname':
        return /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(str);
      case 'idcard':
        return /^\d{15}|\d{18}$/.test(str);
      case 'qq':
        return /[1-9][0-9]{4,}/.test(str);
      case 'url':
        return;
      case 'cn':
        return /^[\u4e00-\u9fa5]{2,}$/.test(str);
      case 'verifyCode':
        return /^\w{6}$/.test(str);
    }
  }
}

// 返回当前时间 HH:mm:ss
function currentTime(){
  var date = new Date(Date.now());

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':');
}

module.exports = {
  formatTime: formatTime,                   // 计算时间
  Verification: Verification,                // 验证手机号码
  removeStorage: removeStorage,             // 删除本地的Storage
  setStorage: setStorage,                   // 添加本地的Storage
  showModal: showModal,                     // 提示框
  url: url,                                   // 配置url
  reLaunch: reLaunch,                        // 弹层跳转
  requestFn: requestFn,                         // 公共的接口
  formatRichText:  formatRichText,
  replaceUP:replaceUP,
  currentTime:currentTime,
  getYMD: getYMD,
  getHM: getHM,
  getW: getW,
  formatNumber:formatNumber
}

