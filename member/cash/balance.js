var that;
const app = getApp()
Page({
data:{

	ready:1

},

	onLoad: function () {
		that = this;
		app.userModel.UserMoney().then(res => {
			if (res.code == 1) 
			{
				that.setData({
          uminfo: res.data
				});
			} 
		})
	},

	submitNext:function () 
	{
   
		that.setData({
			next: true
		});
	}


}) 