
var utils = require('../../utils/utils.js');
var that;
Page({
	onLoad: function () {
		that = this;
		// 管理员认证
		getApp().auth();
		// 加载店铺设置
		that.loadSetting();
	},
	loadSetting: function () {
		// 加载店铺设置
		var query = new Bmob.Query('Seller');
		query.find().then(function (sellerObjects) {
			that.setData({
				seller: sellerObjects[0]
			})
		});
	},
	updateSetting: function (e) {
		var seller = that.data.seller;
		var form = e.detail.value;
		// 格式化数据
		form.min_amount = parseFloat(form.min_amount);
		form.express_fee = parseFloat(form.express_fee);
		// 保存表单信息，除营业时间外
		seller.save(form).then(function (updatedSeller) {
			// 渲染回wxml
			that.setData({
				seller: updatedSeller
			});
			wx.showModal({
				title: '修改成功',
				showCancel: false,
				success: function () {
					wx.navigateBack();
				}
			});
		}, function (err) {
			console.log(err);
		});
	},
	bindTimeChanged: function (e) {
		// 修改营业时间，起始时间共用
		var seller = that.data.seller;
		// 起或始
		var field = e.currentTarget.dataset.field;
		// 保存
		seller.set(field, e.detail.value);
		console.log(e.detail.value)
		seller.save().then(function () {
			console.log('save time success');
			// 渲染
			that.setData({
				seller: seller
			});
		}, function () {
			console.log('save time fail');
		});
	},
	chooseImage: function () {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				var name = utils.random_filename(tempFilePaths[0]);//上传的图片的别名，建议可以用日期命名
				console.log(name);
				var file = new Bmob.File(name, [tempFilePaths[0]]);
				file.save().then(function(logo){
					console.log(logo)
					var seller = that.data.seller;
					// 更新logo存值
					seller.set('logo', logo);
					// 页面存值，wxml渲染
					that.setData({
						new_logo: logo.url()
					});
					// 上传到网络
					seller.save().then(function (res) {
						console.log(res)
					}, function (res) {
						console.log(res)
					});
				},function(error){
					console.log(error);
				})
			}
		})
	}
})