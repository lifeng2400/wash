import { HTTP } from './http.js'
const regeneratorRuntime = require('./runtime.js')
const md5 = require('./md5.js')

export class Security extends HTTP {
  getToken() { // 获取token
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          let code = res.code
          let url = '/wx/judgeUserStatus.ashx'
          this.request({
            url: url,
            data: {
              code: code
            }
          }).then(res => {
            resolve(res.data)
          })
        }
      })
    })
  }

  refreshToken() { // 刷新token
    let { user_id, refresh_token } = JSON.parse(wx.getStorageSync('token'))
    let header = {
      'X-ACCESS-USER': user_id
    }
    return this.request({ url: `/auth/refresh/${refresh_token}`, header: header })
  }

  async getHeader() { // 获取header请求头
    let token = wx.getStorageSync('token')
    let header = {}
    let nowtime = Date.parse(new Date()) / 1000
    if (!token) {
      token = await this.getToken()
      wx.setStorageSync('token', JSON.stringify(token))
    } else {
      token = JSON.parse(token)
      if (nowtime >= token.access_token_expired_time) {
        let refresh_token = await this.refreshToken()
        Object.assign(token, refresh_token.data)
        wx.setStorageSync('token', JSON.stringify(token))
      }
    }
    let { access_token, user_id } = token
    console.log(token)
    header['X-ACCESS-SECURE-TOKEN'] = md5.hexMD5(access_token + user_id + nowtime)
    header['X-TIME'] = nowtime
    header['access_token'] = access_token
    header['X-ACCESS-USER'] = user_id
    return header
  }

  async security({ url, data, method }) { // 需要header请求头验证
    let header = await this.getHeader()
    return this.request({ url, data, method, header })
  }
}
