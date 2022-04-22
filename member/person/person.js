// pages/person/person.js
//获取应用实例
const app = getApp()
import Util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
   service:[
    //  { img: '../../assets/icons/per_service_ic_sign.png', name: '积分签到', page:'sign'},
     { img: '/images/icons/per_service_ic_wallet.png', name: '我的余额', page: '../cash/balance'},
    //  { img: '../../assets/icons/per_service_ic_coupon.png', name: '我的收藏', page: '../myCoupon/myCoupon' },
    //  { img: '../../assets/icons/per_service_ic_cart.png', name: '购物车', page: '../cart/cart'},
    //  { img: '../../assets/icons/per_service_ic_collection.png', name: '我的收藏', page: '../mycollection/mycollection' },
     { img: '/images/icons/per_service_ic_address.png', name: '地址管理', page: '../../address/list/list'},
     { img: '/images/icons/per_service_ic_Invite.png', name: '邀请好友', page: 'hb' },
    //  { img: '../../assets/icons/per_service_ic_note.png', name: '推荐记录', page: '' },
    //  { img: '../../assets/icons/per_service_ic_set.png', name: '设置', page: '' }
   ],
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sign:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   let that=this;
    app.userModel.UserMoney().then(res => {
			if (res.code == 1) 
			{
				that.setData({
          uminfo: res.data
				});
			} 
		})


    // wx.hideTabBar() //隐藏底部tab
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  async onShow() {
    await Util.getFullUserInfo()
    let { user_type } = app.globalData.userInfo
    this.setData({
      showWxAuth: user_type == '0' ? true : false,
      uleve: app.globalData.userInfo.xinji,
      levename:app.globalData.userInfo.levename
    })
  },


  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      var that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
              // 获取到用户的信息了，打印到控制台上看下
         that.triggerEvent('wxAuthorize', res.userInfo)
         let userInfo=res.userInfo;
         if (!userInfo) return
         app.userModel.authSetUserInfo(userInfo).then(() => {
           app.globalData.userInfo.user_type = '1'
           this.setData({
             showWxAuth: false
           })
         //  wx.navigateTo({ url: "/member/phoneBind/index"})
           wx.setStorageSync('is_auth', 'yes')
         })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  
  toOrder(e){
    app.globalData.orderactive= e.currentTarget.dataset.page
    console.log("3213",e.currentTarget.dataset.page)

    wx.switchTab({
      url: '../../order/list/list'
    })
  },

  callReceiver: function (e) {
		var telephone = e.currentTarget.dataset.telephone;
		wx.makePhoneCall({
			phoneNumber: telephone //仅为示例，并非真实的电话号码
		})
	},
  showSign(){
    this.setData({
      sign:false
    })
  },
  closeSign() {
    this.setData({
      sign:true
    })
  },
  toIndex() {
    this.setData({
      sign: true
    })
    wx.switchTab({
      url: '../index/index'
    })
  },
  toPage(e){
    if (e.currentTarget.dataset.page == 'hb'){
      if(this.data.user_type==0)
      {
       wx.getUserProfile({
         desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
         success: (res) => {
           console.log(res.userInfo)
                 // 获取到用户的信息了，打印到控制台上看下
            let userInfo=res.userInfo;
            if (!userInfo) return
               app.userModel.authSetUserInfo(userInfo).then(() => {
                app.globalData.userInfo.user_type = '1'
              this.setData({
                showWxAuth: false
              })
              wx.setStorageSync('is_auth', 'yes');
              wx.navigateBack();
            })
           this.setData({
             userInfo: res.userInfo,
             user_type: 1
           })
         }
       })
      }
      else
      {
        wx.navigateTo({
          url: "../sharecode/sharecode"
        })
      }
    } else if (e.currentTarget.dataset.page == '../cart/cart'){
      wx.switchTab({
        url: '../cart/cart'
      })
    } else if (e.currentTarget.dataset.page == '') {
      wx.showToast({
        title: '开发中...',
        icon: '',
        image: '',
        duration:2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.page,
      })
    }
    
  },
})