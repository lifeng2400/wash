
var utils = require('../../utils/utils.js');

var that;
Page({
	data: {
		categoryIndex: 0
	},
	onLoad: function (options) {
		that = this;
		// 管理员认证
		getApp().auth();
		if (options.objectId) {
			// 缓存数据
			that.setData({
				isEdit: true,
				objectId: options.objectId
			});
			that.loadFood();
		} else {
			that.loadCategories();
		}
	},
	loadFood: function () {
		// 请求待编辑的分类对象
		var query = new Bmob.Query('Food');
		query.include('category');
		query.get(that.data.objectId).then(function (food) {
			that.setData({
				food: food,
				thumb_url: food.get('thumb_url')
			});
			that.loadCategories();
		});
	},
	loadCategories: function () {
		// 加载全部分类，用于picker数据源
		var query = new Bmob.Query('Category');
		query.limit(Number.MAX_VALUE);
		query.find().then(function (categories) {
			console.log(categories)
			that.setData({
				categories: categories,
				category: categories[0]
			});
			that.indexOfCategories();
		});
	},
	indexOfCategories: function () {
		// 找出当前分类下标
		var index = -1;
		// 添加时
		if (!that.data.food) {
			return;
		}
		var category = that.data.food.get('category'); 
		var categories = that.data.categories;
		categories.forEach(function (item, idx) {
			if (item.id == category.objectId) {
				console.log(idx);
				that.setData({
					categoryIndex: idx,
					category: category
				});
			}
		});
	},
	bindCategoryChanged: function (e) {
		// 更新选中分类项
		var index = e.detail.value;
		that.setData({
			categoryIndex: index,
			category: that.data.categories[index]
		});
	},
	add: function (e) {
		// form取值
		var form = e.detail.value;
		// 表单验证
		if (form.title == '') {
			wx.showModal({
				title: '请填写菜品名称',
				showCancel: false
			});
			return;
		}
		if (form.price == '') {
			wx.showModal({
				title: '请填写价格',
				showCancel: false
			});
			return;
		}
		if (form.priority == '') {
			wx.showModal({
				title: '请填写排序号',
				showCancel: false
			});
			return;
		}
		if (!that.data.thumb_url) {
			wx.showModal({
				title: '请上传图片',
				showCancel: false
			});
			return;
		}
		// 添加或者修改分类
		var food = new Bmob.Object('Food');
		// 修改模式
		if (that.data.isEdit) {
			food = that.data.food;
		}
		form.priority = parseInt(form.priority);
		form.price = parseFloat(form.price);
		food.set('title', form.title);
		food.set('price', form.price);
		food.set('summary', form.summary);
		food.set('priority', form.priority);
		food.set('thumb_url', that.data.thumb_url);
		food.set('category', that.data.category);
		food.save().then(function (updatedFood) {
			// 操作成功提示并返回上一页
			wx.showModal({
				title: that.data.isEdit ? '修改成功' : '添加成功',
				showCancel: false,
				success: function () {
					wx.navigateBack();
				}
			});
		}, function (err) {
			console.log(err);
		});
	},
	delete: function () {
		// 确认删除对话框
		wx.showModal({
			title: '确认删除',
			success: function (res) {
				if (res.confirm) {
					var food = that.data.food;
					food.destroy().then(function (result) {
						wx.showModal({
							title: '删除成功',
							showCancel: false,
							success: function () {
								wx.navigateBack();
							}
						});
					});
				}
			}
		});
	},
	upload: function () {
		// 上传或更换菜品图片
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				var name = utils.random_filename(tempFilePaths[0]);//上传的图片的别名，建议可以用日期命名
				console.log(name);
				var file = new Bmob.File(name, [tempFilePaths[0]]);
				file.save().then(function(thumb){
					console.log(thumb)
					// 页面存值，wxml渲染
					that.setData({
						thumb_url: thumb.url()
					});
				}, function(error){
					console.log(error);
				})
			}
		})
	}
})