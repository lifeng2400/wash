const regeneratorRuntime = require('runtime.js')
const md5 = require('md5.js')

const tips = {
  1: "抱歉出现一个错误,请联系开发小哥",
  400: "系统错误",
  402: "验证码有误，请重新输入",
  405: "最多邀请五个人",
  450: "不能关注自己",
  500: "服务器请求超时",
  1000: "问题分类必须选择"
}

class HTTP {
  /**
   * 封装一层的HTTP请求
   */
  request({ url, data = {}, method = "GET", header = {} }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header)
    })
  }

  _request(url, resolve, reject, data, method, header) {
    header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    wx.request({
      url:  'https://wwx.50cms.com:446/apiww' + url,
      data: data,
      method: method,
      header: header,
      success: res => {
        const code = res.statusCode.toString()
        if (code.startsWith("2")) {
          resolve(res.data)
        } else {
          const errorCode = res.data.error_code
          this._showError(errorCode || code)
          reject(res)
        }
      },
      fail: error => {
        reject(error)
        this._showError(1)
      }
    })
  }

  /**
   * 显示错误提示
   */
  _showError(errorCode) {
    if (!errorCode) {
      errorCode = 1
    }
    const tip = tips[errorCode];
    wx.showToast({
      title: tip ? tip : tips[1],
      icon: "none",
      duration: 2000
    })
  }
}

export {
  HTTP
}