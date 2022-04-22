// pages/goodsList/goodsList.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPrice:false,
    minPrice:'',
    highPrice:'',
    goodsList:[ ],
    comp:true,
    saleS1:false,
    saleS2:false,
    priceS1:false,
    priceS2:false,
    myurl:app.myurl

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.showLoading({ title: '获取中...' });
    var that=this;

    var page_index = 1;
    var page_size = 10;
    let type="all";
    app.shopModel.goodList(type,page_index, page_size).then(res => {
            // success
            wx.hideLoading();
            that.setData({
              goodsList: res.data
            })
    })


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
  showPrice(){
    this.setData({
      showPrice: !this.data.showPrice
    })
  },
  bindKeyInput1(e){
    this.setData({
      minPrice: e.detail.value
    })
  },
  bindKeyInput2(e) {
    this.setData({
      highPrice: e.detail.value
    })
  },
  priceList(){
    console.log(this.data.minPrice);
    if (this.data.minPrice == '' || this.data.highPrice == '' ){
      wx.showToast({
        title: '请输入正确金额',
        icon: 'success',
        duration: 3000
      });
    } else if (this.data.highPrice < this.data.minPrice){
      wx.showToast({
        title: '价格区间有误！',
        icon: 'success',
        duration: 3000
      });
    }else{
      this.setData({
        showPrice:false
      })
    }
  },
  enterSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  }
  ,
  // 加入购物车
  addToCart() {
    wx.showToast({
      title: '加入成功',
    })
  },
  // 销售量排序
  saleSort(e){
    this.setData({
      comp: false
    })
    console.log(e.currentTarget.dataset.key);
    if(e.currentTarget.dataset.key == 'up'){
      this.setData({
        saleS1:true,
        saleS2: false
      })
    }else{
      this.setData({
        saleS1: false,
        saleS2: true
      })
    }
  },
  // 价格排序
  priceSort(e) {
    this.setData({
      comp: false
    })
    console.log(e.currentTarget.dataset.key);
    if (e.currentTarget.dataset.key == 'up') {
      this.setData({
       priceS1: true,
        priceS2: false
      })
    } else {
      this.setData({
        priceS1: false,
        priceS2: true
      })
    }
  },
  // 综合排序
  comprehensive(){
    this.setData({
      comp:true,
      priceS1: false,
      priceS2: false,
      saleS1: false,
      saleS2: false
    })
  }
})