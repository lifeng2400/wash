const app = getApp();
const textutil = require('../../utils/textutil.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../assets/imgs/swiperImg.png',
      '../../assets/imgs/swiperImg.png',
      '../../assets/imgs/swiperImg.png'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    tabs: ["图文详情"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    flag: true,
    flagPoster:true,
    indicatoractivecolor: '#F44225',
    collection:false,
    classIndexColor:0,
    classIndexSpecs: 0,
    name: "小熊工厂洗",
    express_fee:10,
    //显示目前的菜单，跟随搜索改变
    showmenu: [],
    //记录用户是否选择了这个菜，不随搜索改变

    shopCarInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

       // 获取购物车数据
       wx.getStorage({
        key: 'shopCarInfo',
        success: function (res) {
          that.setData({
            shopCarInfo: res.data,
            shopNum: res.data.shopNum
          });
        }
      })

    wx.getSystemInfo({
      success: function(res) {
        var foodPageHeight = (res.windowHeight * 750 / res.windowWidth) - 60 - 100
        that.setData({
          foodPageHeight: foodPageHeight,
        })
      }
    })
  /* ------------ 获取列表数据 ------------ */
    
  var paramJson = JSON.stringify({
    gid: options.gid
  });
    wx.showLoading({ title: '加载中...' });
    app.shopModel.goodsdetail({ paramJson }).then(res => {
      wx.hideLoading();
      if (res.code == 1) {  
        res.data.content = textutil.formatRichText(res.data.content)
        let good = res.data;
        this.setData({
          imgUrls:good.images,
          good
        })  
        
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); 
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /* 转发*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '转发dom',
      path: `pages/index/index`,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        //可以获取群组信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
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
  /* 点击减号 */
  bindMinus: function (e) {
    console.log(e);
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function (e) {
    console.log(e);
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  },
  //隐藏弹框
  hidePopup: function () {
    this.setData({
      flag: !this.data.flag
    })
  },
  //展示弹框
  showPopup() {
    this.setData({
      flag: !this.data.flag
    })
  }
  ,
  showPoster(){
    this.setData({
      flagPoster:false
    })
  },
  hidePoster() {
    this.setData({
      flagPoster:true
    })
  },
  /**
 *  图片预览方法
 *  此处注意的一点就是，调用 "wx.previewImage"时，第二个参数要求为数组形式哦
 *  当然，做过图片上传功能的应该会注意到，如果涉及到多张图片预览，图片链接数组集合即为参数 urls！
 */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log(current);
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  // 收藏
  collection(){
    this.setData({
      collection: !this.data.collection
    })
  },
  // 选择颜色
  chooseColor(e){
    this.setData({
      classIndexColor: e.currentTarget.dataset.index,
    });
  },
  // 选择规格
  chooseSpecs(e){
    this.setData({
      classIndexSpecs: e.currentTarget.dataset.index,
    });
  },
  // 去购物车
  toCart(){
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  // 去确认订单
  toOrderConfirm(){
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm',
    })
  },
  // 加入购物车
  addToCart(){
    wx.showToast({
      title: '加入成功',
    })
  },

  // * 加入购物车
  // */
  addShopCar: function () {
    // if (this.data.goodsDetail.properties && !this.data.canSubmit) {
    //   if (!this.data.canSubmit) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请选择商品规格！',
    //       showCancel: false
    //     })
    //   }
    //   this.bindGuiGeTap();
    //   return;
    // }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });
    // 写入本地存储
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
		//更新tabar购物车数字角标
		app.getShopCartNum()
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    //console.log(shopCarInfo);

    //shopCarInfo = {shopNum:12,shopList:[]}
  },

  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.good.id;
    shopCarMap.pic = this.data.good.image;
    shopCarMap.name = this.data.good.title;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.good.GPrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.good.logisticsId;
    shopCarMap.logistics = this.data.good.logistics;
    shopCarMap.weight = this.data.good.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },
  bulidupingTuanInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pingtuanId = this.data.pingtuanOpenId;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectptPrice;
    //this.data.goodsDetail.basicInfo.pingtuanPrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },


    //* 组建立即购买信息

 buliduBuyNowInfo: function () {
  var shopCarMap = {};
  
  delete this.data.good.content;   //删掉详细再传过去
  shopCarMap.good=this.data.good;
  shopCarMap.number = this.data.num;
    var buyNowInfo = {};
  if (!buyNowInfo.shopNum) {
    buyNowInfo.shopNum = 0;
  }
  if (!buyNowInfo.shopList) {
    buyNowInfo.shopList = [];
  }
  buyNowInfo.shopList.push(shopCarMap);
  return buyNowInfo;
},
  buyNow: function () {
    var that = this;
    if (that.data.num < 1) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    setTimeout(function () {
      wx.hideLoading();
      //组建立即购买信息
      var buyNowInfo = that.buliduBuyNowInfo();
      // 写入本地存储
      wx.setStorage({
        key: "buyNowInfo",
        data: buyNowInfo
      })
     // that.closePopupTap();

      wx.navigateTo({
        url: "/pages/order/orderConfirm/orderConfirm?orderType=buyNow"
      })
    }, 1000);
    wx.showLoading({
      title: '商品准备中...',
    })
  }


})