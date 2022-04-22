
var that;
const app = getApp()
Page({
	onLoad: function () {
		that = this;
		// 管理员认证
		getApp().auth();
	},
	onShow: function () {
		that.loadCategories();
	},

	loadCategories: function () {
		app.userModel.getshareuser().then(res => {
		if (res.code == 1) 
		{
			that.setData({
				categories: res.data
			});
		} 
	})
	},

	add: function () {
		// 跳转添加页面
		wx.navigateTo({
			url: '../add/add'
		});
	},
})