
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');

var that;

Page({
	data: {
	},
	onLoad: function (options) {
		that = this;
		if (options.remark) {
			that.setData({
				remark: options.remark
			});
		}
	},
	setRemark: function (e) {
		var remark = e.detail.value.remark || '';
		// 推送通知
		WxNotificationCenter.postNotificationName("remarkNotification", remark);
		wx.navigateBack();
	}
})