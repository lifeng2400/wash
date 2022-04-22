const app = getApp()
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
var that;

Page({
	data: {
		visual: 'hidden'
	},
	onLoad: function (options) {
		that = this;
		if (options.isSwitchAddress) {
			that.setData({
				isSwitchAddress: true
			});
		}
	},
	onShow: function () {
		that.getAddress();	
	},
	add: function () {
		wx.navigateTo({
			url: '../add/add'
		});
	},
	getAddress: function () {

		let that=this;
		app.userModel.getAddressList().then(res => {
				if (res.code == 1) 
				{
					that.setData({
						addressList: res.data,
						visual:'hidden' 
					});
				} 
				else {
					that.setData({
						addressList: null,
						visual:'show'
					});
				}
			})

	},
	edit: function (e) {
		var index = e.currentTarget.dataset.index;
		var objectId = that.data.addressList[index].id;
		wx.navigateTo({
			url: '../add/add?objectId=' + objectId
		})
	},
	selectAddress: function (e) {
		if (!that.data.isSwitchAddress) {
			return;
		}
		var index = e.currentTarget.dataset.index;
		WxNotificationCenter.postNotificationName("addressSelectedNotification", that.data.addressList[index].id);
		wx.navigateBack();
	}
})