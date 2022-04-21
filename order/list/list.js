const app = getApp()

var that;

Page({
	data: {
		tabs: ["全部", "待付款", "待收货","待送货","完成"],
    activeIndex: 0,
		page_index: 0,
		orderList: [],
		loadingTip: '',
		isAdmin: wx.getStorageSync('isAdmin'),
		visual: 'hidden'
		
	},
	onLoad: function () {
	  	that = this;
    	let	 orderactive = app.globalData.orderactive;
		 console.log("21212121",orderactive);
    //判断是否带参数，带的话执行里边逻辑
    if (orderactive != null || orderactive != '' || orderactive != undefined) {
      //设置到页面data中，其他地方就可以使用了
      this.setData({
        activeIndex:orderactive 
      });
    }
    //  记得，一定要还原全局数据
    app.globalData.orderactive = 0
	},
	showDetail: function (e) {
		var index = e.currentTarget.dataset.oid;
		// 传递订单objectId
		wx.navigateTo({
			url: '../detail/detail?objectId=' + index
		})
	},

	tabClick: function (e) {
    console.log(e);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
	onShow: function () {
		var that = this;
    wx.showLoading({ title: '获取中...' });
		var that=this;
		var page_index = 1;
		var page_size = 10;
		let type="all";


    app.shopModel.orderList(type,
      page_index, 
      page_size).then(res => {
            // success
						wx.hideLoading();
						
						var orderListall= res.data.data;
            var orderListnopay=orderListall.filter(item=> item.status==-1)
						var orderListnoget=orderListall.filter(item=> item.status==1)
						var orderListnoput=orderListall.filter(item=> item.status==2)
						var orderListok=orderListall.filter(item=> item.status==3)


            that.setData({
							orderListall: orderListall,
							orderListnopay:orderListnopay,
							orderListnoget:orderListnoget,
							orderListnoput:orderListnoput,
							orderListok:orderListok,
							visual:res.data.total< 1 ?'show' : 'hidden'


            }) 
		})
		
		that.loadOrder();
	},
	loadOrder: function () {
		var page_size = 20;
		var query = new Bmob.Query('Order');
		query.include('user');
		query.include('address');
		if (!wx.getStorageSync('isAdmin')) {
			query.equalTo('user', Bmob.User.current());
		}
		// 按照priority逆序排列
		query.descending('createdAt');
		// 分页
		query.limit(page_size);
		query.skip(that.data.page_index * page_size);
		// 查询所有数据
		query.find().then(function(results) {
				// 请求成功将数据存入orderList
				that.setData({
					orderList: that.data.page_index == 0 ? results : that.data.orderList.concat(results)
				});
				// 判断上拉加载状态
				if (results.length < page_size && that.data.page_index != 0) {
					that.setData({
						loadingTip: '没有更多内容'
					});
				}
				// holder
				that.setData({
					visual: results.length == 0 && that.data.page_index == 0 ? 'show' : 'hidden'
				});
			}, function(error) {
		    //	alert("查询失败: " + error.code + " " + error.message);
			});
	},
	onReachBottom: function () {
		that.setData({
			page_index: ++that.data.page_index
		});
		that.loadOrder();
	},
	payment: function (e) {
		var index = e.currentTarget.dataset.oid;
wx.navigateTo({
	url: '/order/orderPay/orderPay?oid='+index,
})


	}
})