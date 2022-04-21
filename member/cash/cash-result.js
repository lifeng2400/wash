var that;

Page({
	onLoad: function () {
		that = this;
		that.setData({
			user: Bmob.User.current()
		});
	}
}) 