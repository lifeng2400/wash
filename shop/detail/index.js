// pages/menu/menu.js
import md5 from "../../utils/md5.js";
const textutil = require('../../utils/textutil.js');
var app = getApp();
//行高
var food_row_height = 75;
//最大行数
var max_scroll_length = 5;
//标题栏高度
var cart_offset = 63;

Page({

  //页面的初始
  data: {
    seller:{
			business_end:"21:00",
			logourl:"/images/logo.png",
			name:"小熊工厂洗",
			min_amount:"99",
			business_start:"11:03",address:"东路269号",
			notice:"洗衣洗鞋新时尚",telephone:"13378719129",express_fee:"1"
		},
    name: "小熊工厂洗",
    express_fee:10,
    //显示目前的菜单，跟随搜索改变
    showmenu: [],
    //记录用户是否选择了这个菜，不随搜索改变


    menu: [],
    inputShowed: false,
    inputVal: "",
    selected: 0,
    cost: 0,
    //用户浏览已选择的商品
    showCart: false,
    animationData: null,
    foodChoosed: [],
    cartHeight: 667,
    //菜单页面高度
    foodPageHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      name: options.name
    })
    if(options.uid)
      {
          app.userModel.SetUserP(options.uid);//上一级
      }
    wx.getSystemInfo({
      success: function(res) {
        var foodPageHeight = (res.windowHeight * 750 / res.windowWidth) - 60 - 100
        that.setData({
          foodPageHeight: foodPageHeight,
        })
      }
    })
    var that = this;
    wx.showLoading({ title: '获取中...' });
    var that=this;
    app.shopModel.goodindex().then(res => {
            // success
            wx.hideLoading();
            that.setData({
              showmenu: res.data
            })
    })

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



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  turnMenu: function(e) {
    var that = this
    that.setData({
      selected: e.currentTarget.dataset.index
    })
  },

  addToTrolley: function(e) {
    //购物车一栏中增加食物
    var info = this.data.showmenu;
    var foodNum = this.data.foodChoosed;

    if (e.currentTarget.dataset.productid !== undefined) {
      for (var i = 0; i < foodNum.length; i++) {
        if (foodNum[i].id === e.currentTarget.dataset.productid) {
          var nowFood = foodNum[i]
          break;
        }
      }
    } else {
      //正常点餐界面增加食物
      var nowFood = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    }

    //购物车数目+1
    nowFood.numb++;
    if (nowFood.numb === 1) {
      foodNum.push(nowFood)
    }

    const newCost = this.data.cost + nowFood.price
    this.setData({
      cost: Number(newCost.toFixed(2)),
      showmenu: info,
      foodChoosed: foodNum
    })
  },

  removeFromTrolley: function(e) {
    var info = this.data.showmenu;
    var foodNum = this.data.foodChoosed;
    if (e.currentTarget.dataset.productid !== undefined) {
      for (var i = 0; i < foodNum.length; i++) {
        if (foodNum[i].id === e.currentTarget.dataset.productid) {
          var nowFood = foodNum[i]
          break;
        }
      }
    } else {
      var nowFood = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    }

    //购物车数目减一
    nowFood.numb--;
    if (nowFood.numb === 0) {
      var deleted = -1;
      for (var index = 0; index < foodNum.length; index++) {
        if (foodNum[index] === nowFood) {
          deleted = index;
          break;
        };
      }
      foodNum.splice(deleted, 1)
    }

    this.setData({
      cost: Number((this.data.cost - nowFood.price).toFixed(2)),
      showmenu: info,
      foodChoosed: foodNum
    })
  },


  gotocheck:function(e) 
  {
    var that = this;
    if (that.data.cost > this.data.seller.min_amount) {
      wx.showToast({
        title: '准备下单',
        icon: 'loading',
        duration: 1000
      })
      var foodInfoList = that.data.foodChoosed.map((item) => {
        return {
          'foodName': item.foodName,
          'isReady': false,
          'isFinished': false,
          'getTime': new Date(),
          'numb': item.numb,
          'price': item.price,
          'id': item.id
        }
      });
      wx.navigateTo({
        url: '../../order/checkout/checkout?quantity=' + that.data.quantity + '&amount=' + that.data.cost +'&express_fee=' + that.data.express_fee + '&carts=' + JSON.stringify(foodInfoList)
      });
    }
    
  },

  gotoPay: function(e) {
    var that = this;
    if (that.data.cost > 0) {
      wx.showToast({
        title: '准备支付',
        icon: 'loading',
        duration: 1000
      })
      var userInfo = wx.getStorageSync("userInfo")
      var foodInfoList = that.data.foodChoosed.map((item) => {
        return {
          'userName': userInfo.nickName,
          'foodName': item.foodName,
          'isReady': false,
          'isFinished': false,
          'getTime': new Date(),
          'numb': item.numb,
          'price': item.price
        }
      });
      wx.request({
        url:   '/hasPermission?nickName=' + userInfo.nickName,
        method: 'GET',
        success: function(res) {
          if (res.data === false) {
            wx.showToast({
              title: '无权限',
              icon: 'fail',
              duration: 1000
            })
          } else {
            var myHash = md5(userInfo.nickName + myKey)
            wx.request({
              url: myUrl + '/insertFoodInfo?myHash=' + myHash,
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              data: {
                'list': foodInfoList,
                'openId': wx.getStorageSync('openid'),
                'sessionKey': wx.getStorageSync('session_key'),
              },
              success: function(res) {
                if (res.data == "success") {
                  wx.showToast({
                    title: '下单成功',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(function() {
                    wx.switchTab({
                      url: '/pages/order/order'
                    })

                  }, 1000)
                } else {
                  wx.showToast({
                    title: '权限错误，联系开发者',
                    icon: 'none',
                    duration: 1000
                  })
                }
              },
              fail: error => {
                wx.showToast({
                  title: '下单失败',
                  icon: 'fail',
                  duration: 1000
                })
                setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/order/order'
                  })
                }, 1000)
              }
            })
          }
        },
        fail: err => {
          return
        }
      })
    }
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    var that = this;
    this.setData({
      inputVal: "",
      showmenu: that.data.menu
    });
  },
  inputTyping: function(e) {
    var nowInput = e.detail.value;
    var filteredMenu = this.filterMenu(nowInput);
    this.setData({
      inputVal: e.detail.value,
      showmenu: filteredMenu
    });
  },

  filterMenu: function(input) {
    var that = this;
    var filteredMenu = that.data.menu.map((item) => {
      let newContent = item.menuContent.filter((item) => {
        return item.foodName.includes(input);
      })
      return {
        "typeName": item.typeName,
        "menuContent": newContent
      }

    })
    return filteredMenu;
  },

  clearCarTap: function() {
    var that = this;
    wx.showModal({
      title: '清除',
      content: '是否确认清除购物车兄弟？清除后的不能复原',
      confirmText: "确定",
      cancelText: "点错了",
      success: function(res) {
        if (res.confirm) {
          that.clearCar()
        } else {
          console.log('取消清除购物车操作')
        }
      }
    });
  },

  clearCar: function() {
    var that = this;
    var clearMenu = that.data.menu.map((item) => {
      item.menuContent.forEach(function(value, index) {
        value.numb = 0;
      })
      return {
        "typeName": item.typeName,
        "menuContent": item.menuContent,
      }
    })
    this.setData({
      cost: 0,
      menu: clearMenu,
      showmenu: clearMenu,
      foodChoosed: [],
    })

  },

  openCart: function() {
    var that = this;
    if (that.data.showCart) {
      return;
    }
    var allItemsHeight = (that.data.foodChoosed.length + 1) * food_row_height
    var scrollHeight = that.data.foodChoosed.length < max_scroll_length ? allItemsHeight :
      (max_scroll_length + 1) * food_row_height
    var cartHeight = scrollHeight + cart_offset;
    var translateY = cartHeight + 100
    wx.getSystemInfo({
      success: function(res) {
        //转换成px单位，100rpx是购物车导航栏高度
        translateY = Number(translateY * (res.windowWidth / 750))
      }
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    })
    that.animation = animation
    animation.translateY(-1 * translateY).step()
    this.setData({
      scrollHeight: scrollHeight,
      cartHeight: cartHeight,
      showCart: !that.data.showCart,
      animationData: animation.export(),
    })

  },

  closeCart: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    })
    that.animation = animation
    animation.translateY(that.data.translateY).step()
    this.setData({
      showCart: !that.data.showCart,
      animationData: animation.export(),
    })
  },

  call: function () {
		wx.makePhoneCall({
			phoneNumber: this.data.seller.telephone //仅为示例，并非真实的电话号码
		})
  },
  


  
  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
     let content=e.currentTarget.dataset.content
     content=textutil.formatRichText(content)
    this.setData({
       mycontent:content,
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },


})