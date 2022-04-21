var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
const app = getApp()
var that;

Page({
	data: {
		personCountIndex: 0,
		remark:'',
		submitEnabled:true,
		takemode:1
	},
	onLoad: function (options) {
		that = this;""
		that.loadAddress();
		// 注册通知
        WxNotificationCenter.addNotification("addressSelectedNotification", that.getSelectedAddress, that);
        WxNotificationCenter.addNotification("remarkNotification", that.getRemark, that);
        // 购物车获取参数
        that.setData({
        	carts: JSON.parse(options.carts)
        });
        // 读取商家信息
        getApp().loadSeller(function (seller) {
        	that.setData({
        		seller: seller
        	});
        });
        that.setData({
        	amount: parseFloat(options.amount),
        	quantity: parseInt(options.quantity),
					express_fee: parseInt(options.express_fee),	
					showexpress_fee:parseInt(options.express_fee),	
        	total: parseFloat(options.amount) + parseInt(options.express_fee)
        });
        that.initpersonCountArray();
	},
	selectAddress: function () {
		wx.navigateTo({
			url: '../../address/list/list?isSwitchAddress=true'
		});
	},
	getSelectedAddress: function (addressId) {
		console.log(addressId);
		app.userModel.getAddress(addressId).then(res => {
			if (res.code == 1) 
			{
				that.setData({
					address: res.data
				});
			} 
		})
	},
	loadAddress: function () {

		var that = this;
    app.userModel.getDefaultAddress().then(res => {
        if (res.code == 1) 
        {
          that.setData({
            address: res.data
          });
        } 
        else {
          that.setData({
            address: null
          });
        }
      })
	},
	initpersonCountArray: function () {
		// 初始化用户数
		var personCountArray = ["18:00-19:00","19:00-20:00","20:00-21:00"];
		that.setData({
			personCountArray: personCountArray
		});
	},
	getRemark: function (remark) {
		console.log(remark)
		that.setData({
			remark: remark
		});
	},
	naviToRemark: function () {
		wx.navigateTo({
			url: '../remark/remark?remark=' + (that.data.remark || '')
		});	
	},
	bindPickerChange: function(e) {
		// 监听picker事件
		this.setData({
			personCountIndex: e.detail.value
		})
	},

	radioChange: function(e) {
		// 监听picker事件
		let showexpress_fee=this.data.express_fee;
		if(e.detail.value==0)
		showexpress_fee=0;
		let amount=this.data.amount;
		console.log('radio发生change事件，携带value值为：', e.detail.value)

		this.setData({
			takemode: e.detail.value,
			showexpress_fee:showexpress_fee,
			total: parseFloat(amount) + parseInt(showexpress_fee)
		})
	},


	toPay() {
let that=this;
      if (!this.data.submitEnabled) return
			if (!this.data.address) 
			{
        wx.hideLoading();
        wx.showModal({
          title: '友情提示',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
//开始打包
      let  tdata={
        paramJson: JSON.stringify({
          listItem:this.data.carts,
					curAddressData:this.data.address,
					express_fee:that.data.showexpress_fee,
					title:that.data.carts[0].title,
					quantity:that.data.quantity,
					amount:that.data.amount,
					total:that.data.total,
					status:-1,
					remark:that.data.remark,
					takemode:that.data.takemode,       //1为自提  2为上门
					OMsg:that.data.personCountArray[that.data.personCountIndex]
        })
			};

			wx.showLoading({ title: '提交订单中请稍等...' });

			that.setData({
        submitEnabled: false
      })
       app.shopModel.addOrder(tdata).then(res => {
				wx.hideLoading();
         if (res.code == 1) 
         {
					that.setData({
					address:'',
					carts:'',
					amount:'',
					express_fee:'',
					total:'',
					})
           wx.navigateTo({
            url: '../orderPay/orderPay?oid='+res.data.id
          })
         } 
         else {
					
			that.setData({
        submitEnabled: true
      })
         }
   });


  },


	payment: function () {
		// 创建订单
		var order = new Bmob.Object('Order');
		order.set('user', Bmob.User.current());
		order.set('address', that.data.address);
		order.set('express_fee', that.data.express_fee);
		order.set('title', that.data.carts[0].title);
		order.set('quantity', that.data.quantity);
		order.set('amount', that.data.amount);
		order.set('total', that.data.total);
		order.set('status', 0);
		order.set('detail', that.data.carts);
		order.save().then(function (orderCreated) {
			// 保存成功，调用支付
			getApp().payment(orderCreated);
		}, function (res) {
			console.log(res)
			wx.showModal({
				title: '订单创建失败',
				showCancel: false
			})
		});

	},
	





})