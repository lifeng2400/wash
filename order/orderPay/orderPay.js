
const app = getApp()
Page({

  
  /**
   * 页面的初始数据
   */
  data: {
    price:0,
    did:0,
    payway:1,
    yuer:0
  },


  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.data.payway=e.detail.value;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let did=options.oid;
    this.getDD(did);
      this.setData({ 
      did: did
      });
  },

  getUserye(UOpenID) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });

    Http.post('/wxapp/getUserInfo.ashx', { }).then(res => {
      wx.hideLoading();
      if (res.code == 1) {
     
        _this.setData({ yuer:res.result.yuer});
        _this.data.yuer=res.result.yuer;

      }
    }, err => {
      wx.hideLoading();
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

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
  onShareAppMessage: function () {
  
  },

  /* --------------- 获取订单详细信息 --------------- */
  getDD(DID) {
    var that = this;
    wx.showLoading({ title: '加载中...' });
    app.shopModel.getOrder(DID).then(res => {
    wx.hideLoading();
    if (res.code == 1) {
      let ddInfo = res.data;
      this.setData({ ddInfo });
      that.data.price=ddInfo.OLastPrice;

      console.log(ddInfo);
      // this.setData({ storeitems: res.storeitems });
    }
       else {
       }
  });

 
  },
  
  savepay: function (e) {
    var that = this;
    var recordId=this.data.ddInfo.OrderID;
    var mount=this.data.ddInfo.OLastPrice;
  console.log(e.detail)
    //var amount =99;
    if (mount == "" || mount*1 < 0) 
    {
      wx.showModal({
        title: '错误',
        content: '请填写正确的金额',
        showCancel: false
      })
      return
    }
    
    if(this.data.payway==1)
  { 
    
    app.shopModel.wxpay(app, mount, recordId, "/pages/shop/order/order");    
    //wxpay.wxpay(app, mount, recordId, "/pages/serve/serve");    
  }
   else
   {
    if (mount*1>this.data.yuer || mount*1 < 0) 
    {

      wx.showModal({
        title: '错误',
        content: '余额不足,请使用微信直接支付',
        showCancel: false
      })
      return

    }else
    {
 // 
 var _this = this;
 wx.showLoading({
   title: '支付中...',
 })


 Http.post('/pay/yepay.ashx', {
  token:app.userInfo.UOpenID,
  money:this.data.price,
  payName:"余额支付",
  orderId:this.did,
  }).then(res => {
   wx.hideLoading();
   if (res.code == 1) {
     wx.showToast({title: '支付成功'})
     wx.reLaunch({
      url: "/pages/serve/serve"
    });
   }
 }, err => {
   wx.hideLoading();
 });


    }

   }
  
  }
})