import Util from '../../utils/util.js'
const regeneratorRuntime = require('../../utils/runtime.js')
const app = getApp()
let timer

Page({
  data: {
    clock: 60,
    showBindAgain: false,
    userInfo: {},
    tel: ''
  },


  onLoad(options) {
    this.getFullUserInfo();
  },

  onHide() {

  },

  onShareAppMessage() {

  },

  /* 获取用户所有信息 */
  getFullUserInfo() {
    app.userModel.getFullUserInfo().then(res => {
      this.setData({ userInfo: res.data })
    })
  },

  /* 更新用户所有信息 */
  updateFullUserInfo() {
    return app.userModel.getFullUserInfo().then(res => {
      app.globalData.userInfo.phone_number = res.data.phone_number
      this.setData({ userInfo: res.data })
    })
  },

  /* 验证码倒计时 */
  countDown() {
    let count = 60;
    this.setData({
      clock: count,
      showBindAgain: true
    });
    clearInterval(timer);
    timer = setInterval(() => {
      if (count > 0) {
        count--;
        this.setData({
          clock: count
        });
      } else {
        clearInterval(timer);
        this.setData({
          showBindAgain: false
        });
      }
    }, 1000);
  },

  /* 获取验证码 */
  getCode() {
    let tel = this.data.tel;
    if (!tel) {
      return app.qx.showToast({ title: '请输入手机号', icon: 'none' });
    }
    if (!Util.regex(tel, 'mobile')) {
      return app.qx.showToast({ title: '请输入正确的手机号', icon: 'none' });
    }
    app.userModel.sendSms(tel).then(() => {
      this.countDown();
    })
  },

  /* 手机号输入 */
  telInput(e) {
    this.setData({
      tel: e.detail.value
    });
  },

  /* 微信获取手机号 */
  async getPhoneNumber(e) {
    let { encryptedData, iv } = e.detail
    if (encryptedData && iv) {
      await app.commonModel.authPhoneNum({ encryptedata: encryptedData, iv })
      await this.updateFullUserInfo()
      await app.qx.showToast({ title: '授权成功' })
      app.qx.navigateBack()
    }
  },

  /* 绑定手机号提交 */
  async phoneNumberBind(e) {
    let { tel, code } = e.detail.value;
    if (!tel) {
      return app.qx.showToast({ title: '请输入手机号', icon: 'none' });
    }
    if (!code) {
      return app.qx.showToast({ title: '请输入手机号', icon: 'none' });
    }
    app.qx.showLoading({ title: '正在提交...' });
    await app.userModel.bindTel(tel, code);
    await this.updateFullUserInfo();
    await app.qx.hideLoading();
    await app.qx.showToast({ title: '验证成功' });
    clearInterval(timer);
    app.qx.navigateBack();
  }
})