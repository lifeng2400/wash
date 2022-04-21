var that;
const app = getApp()
Page({
	data: {
		isAdmin: wx.getStorageSync('isAdmin')
	},
	onLoad: function (options) {
		that = this;
		that.loadOrder(options.objectId);
		that.setData({
			objectId: options.objectId
		});
		getApp().loadSeller(function (seller) {
			that.setData({
				seller: seller
			});
		});
	},


	loadOrder: function (objectId) {
		app.shopModel.getOrderDetail(objectId).then(res => {
		if (res.code == 1) 
		{
			that.setData({
				order: res.data
			});
		} 
	})
	},

oldloadOrder: function (objectId) {
		// 加载订单详情
		var query = new Bmob.Query('Order');
		query.include('user');
		query.include('address');
		query.get(objectId).then(function (order) {
			that.setData({
				order: order
			});
		});
	},
	contact: function () {
		var telephone = that.data.seller.get('telephone');
		wx.makePhoneCall({
			phoneNumber: telephone //仅为示例，并非真实的电话号码
		})
	},
	payment: function () {
		// 支付
		getApp().payment(that.data.order);
	},
	cancel: function () {
		// 取消确认
		wx.showModal({
			title: '确定要取消订单吗？',
			success: function (res) {
				if (res.confirm) {
					// 取消订单
					var order = that.data.order;
					order.set('status', -1);
					order.save().then(function (orderSaved) {
						wx.showToast({
							title: '订单已取消',
							success: function () {
								that.setData({
									order: orderSaved
								});
							}
						});
					})
				}
			}
		});
	},
	callReceiver: function (e) {
		var telephone = e.currentTarget.dataset.telephone;
		wx.makePhoneCall({
			phoneNumber: telephone //仅为示例，并非真实的电话号码
		})
	},
	send: function () {
		// 取消确认
		wx.showModal({
			title: '确定要派送订单吗？',
			success: function (res) {
				if (res.confirm) {
					// 取消订单
					var order = that.data.order;
					order.set('status', 2);
					order.save().then(function (orderSaved) {
						wx.showToast({
							title: '订单已派送',
							success: function () {
								that.setData({
									order: orderSaved
								});
							}
						});
					})
				}
			}
		});
	}
})