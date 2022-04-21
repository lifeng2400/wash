
var that;
Page({
	onLoad: function () {
		that = this;
		// 管理员认证
		getApp().auth();
	},
	onShow: function () {
		that.loadFood();
	},
	loadFood: function () {
		var query = new Bmob.Query('Food');
		query.include('category');
		query.ascending('priority');
		query.limit(Number.Max_VALUE);
		query.find().then(function (foodObjects) {
			// console.log(foodObjects);
			that.setData({
				foodObjects: foodObjects
			});
		});
	},
	add: function () {
		// 跳转添加页面
		wx.navigateTo({
			url: '../add/add'
		});
	},
	showDetail: function (e) {
		var index = e.currentTarget.dataset.index;
		var objectId = that.data.foodObjects[index].id;
		wx.navigateTo({
			url: '../add/add?objectId=' + objectId
		});
		// console.log(objectId);
	}
})