var that;
const app = getApp()
Page({
data:{

	countList:[
         {cash_id:1,trade_msg: '会员消费获得',  balance:'sign',direction:'20',amout:'3333',add_time:'time'},
         { img: '/images/icons/per_service_ic_wallet.png', name: '我的余额', page: '../cash/balance'}]

},

	onLoad: function () {
		that = this;
    app.userModel.UserMoneyList().then(res => {
			if (res.code == 1) 
			{
				that.setData({
          countList: res.data
				});
			} 
		})

	}
}) 