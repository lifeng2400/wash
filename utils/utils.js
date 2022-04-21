
const searchText = {
  '1': 'qsh',
  '2': 'ush'
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
