// pages/home/pages/home/secKill/secKill.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app = getApp()
Page({

  data: {
    secKill:[],
    imgurl:app.myurl,
    mapHeigth:"500rpx"
  },
  onLoad: function () {
    this.getnear();
  },

  getnear: function () {
    let that=this;
    qqmapsdk = new QQMapWX({
        key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
    });
    that.reloadCurrent();

  },
    togoodsDetail(){
      wx.navigateTo({
        url: '/pages/shop/goods/goodsDetail',
      })
    },

    reloadCurrent: function () {
     let that = this;
      that.setData({
          address: '正在定位中...',
          city: '正在定位中...',
          pageNo    : 1,
          pageSize  : 10,
          storeItems: []
      });
      // 调用接口
      qqmapsdk.reverseGeocoder({
          poi_options: 'policy=2',
          get_poi: 1,
          success: function(res) {
          // 渲染给页面
             console.log(res);
              that.setData({
                  city: res.result.address_component.city,
                  lon:res.result.location.lng,
                  lat:res.result.location.lat
              });
              that.getstorelist();
          },
          fail: function(res) {
      //         console.log(res);
              that.getstorelist();
          },
          complete: function(res) {
      //         console.log(res);
          }
      });
  },

   getstorelist:function()
   {
    let that=this;
    wx.showLoading({ title: '获取中...' });
    var page_index = that.data.pageNo;
    var page_size= that.data.pageSize;
    let type="all";
    let lon=that.data.lon;
    let lat=that.data.lat;
    
    app.shopModel.nearindex(type,lon,lat,page_index, page_size).then(res => {
      wx.hideLoading();
        if (res.code == 1) 
        {   
          let storeItem =res.data;
          for (let i = 0; i < storeItem.length; i++) {
            if (storeItem[i].distance > 1000) {
              storeItem[i].distance = (storeItem[i].distance / 1000).toFixed(1) + 'km';
            } else {
              storeItem[i].distance = storeItem[i].distance + 'm';
            }
          }
          if (storeItem) {
            console.log("storeItem",storeItem);
            
            var checkeddata = { checkedNum: that.data.storeItems.concat(storeItem)};
            this.triggerEvent("traCheckedNum",checkeddata)
            that.setData({
              storeItems: that.data.storeItems.concat(storeItem),
              pageNo: that.data.pageNo + 1
            })
  
          }
        } 
      })
   }


  
})
