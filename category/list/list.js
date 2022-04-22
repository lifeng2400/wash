
var that;
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
		var query = new Bmob.Query('Category');
		query.ascending('priority');
		query.limit(Number.Max_VALUE);
		query.find().then(function (categories) {
			console.log(categories);
			that.setData({
				categories: categories
			});
		});
	},
	add: function () {
		// 跳转添加页面
		wx.navigateTo({
			url: '../add/add'
		});
	},
})