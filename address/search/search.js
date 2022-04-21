
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
var that;
var qqmapsdk;
Page({
    onLoad: function (options) {
        that = this;
        qqmapsdk = new QQMapWX({
            key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
        });
        that.reloadCurrent();
    },
    keywordTyping: function (e) {
        // 键盘不断录入绑定取值
        var keyword = e.detail.value;
        // 向腾讯地图接口发送请求
        qqmapsdk.getSuggestion({
            keyword: keyword,
            region: that.data.city,
            success: function (res) {
                console.log(res);
                // 保存地址数组
                that.setData({
                    result: res.data
                });
            }, 
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {
                console.log(res);
            }
        });
    },
    addressTapped: function (e) {
        var address = e.currentTarget.dataset.address;
        var title = e.currentTarget.dataset.title;
        var addname = e.currentTarget.dataset.addname;
        var location = e.currentTarget.dataset.location;

        // 取出点中的地址，然后使用WxNotification回传给首页
        WxNotificationCenter.postNotificationName("poiSelectedNotification", {title,address,addname,location});
        wx.navigateBack();

    },
    geoTapped: function () {
        var title = that.data.title;
        var address = that.data.address;
        var addname = that.data.address_component;
        var location = that.data.location;
        WxNotificationCenter.postNotificationName("poiSelectedNotification", {title,address,addname,location});
        wx.navigateBack();

    },
    reloadCurrent: function () {
        that.setData({
            address: '正在定位中...',
        });
        // 调用接口
        qqmapsdk.reverseGeocoder({
            poi_options: 'policy=2',
            get_poi: 1,
            success: function(res) {
            // 渲染给页面
            console.log(res);

                that.setData({
                    address: res.result.formatted_addresses.recommend,
                    title:res.result.address_reference.landmark_l2.title,
                    result: res.result.pois,
                    city: res.result.address_component.city,
                    address_component:res.result.address_component,
                    location:res.result.location
                });
            },
            fail: function(res) {
        //         console.log(res);
            },
            complete: function(res) {
        //         console.log(res);
            }
        });
    }
})
