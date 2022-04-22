// 初始化AV
import { indexModel } from '/models/indexModel.js'
import { userModel } from '/models/userModel.js'
import { shopModel } from '/models/shopModel.js'
import commonModel from '/models/common.js'
import Util from '/utils/util.js'


App({
	onLaunch: function (options) {


		var that = this;
	  //	that.login();
		// 设备信息
		this.qx = Util.promisic()
		console.log("全局onLaunch options==" + JSON.stringify(options))
		let q = decodeURIComponent(options.query.q)
		if (q){
      var uid=this.getQueryString(q, 'uid');
		  	that.userModel.SetUserP(uid);//上一级
		   console.log("全局onLaunch onload url=" + q)
		   console.log("全局onLaunch onload 参数 uid=" + uid)
		}
		wx.getSystemInfo({
			success: function(res) {
				that.screenWidth = res.windowWidth;
				that.screenHeight = res.windowHeight;
				that.pixelRatio = res.pixelRatio;
			}
		});
	},


	//获取购物车数量
	getShopCartNum:function(){
		var that = this
		wx.getStorage({
		  key: 'shopCarInfo',
		  success: function (res) {
		    if (res.data) {
		      if (res.data.shopNum > 0) {
		        wx.setTabBarBadge({
		          index: 2,
		          text: '' + res.data.shopNum + ''
		        })
		      } else {
		        wx.removeTabBarBadge({
		          index: 2,
		        })
		      }
		    } else {
		      wx.removeTabBarBadge({
		        index: 2,
		      })
		    }
		  }
		})
	},
	getQueryString:function (url,name) {
		 console.log("url = "+url)
		 console.log("name = " + name)
		 var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
		 var r = url.substr(1).match(reg) 
		 if (r != null) {
		  console.log("r = " + r)
		  console.log("r[2] = " + r[2])
		  return r[2]
		 }
		 return null;
		},

	auth: function () {
		// 管理员认证
		if (!wx.getStorageSync('isAdmin')) {
			wx.switchTab({
				url: '../../shop/index/index'
			});
		}	
	},




	login: function() {
		// 用户登录
		var user =	new Bmob.User;
		if (Bmob.User.current()) {
			return;
		}
		wx.login({
			success: function (res) {
				user.loginWithWeapp(res.code).then(function (user) {
					var openid = user.get("authData").weapp.openid;
					wx.setStorageSync('openid', openid)
					wx.setStorageSync('isAdmin', user.get('isAdmin'));
					var u = Bmob.Object.extend("_User");
					var query = new Bmob.Query(u);
					query.get(user.id, {
						success: function (result) {
							wx.setStorageSync('own', result.get("uid"));
						},
						error: function (result, error) {
							console.log("查询失败");
						}
					});
			//保存用户其他信息，比如昵称头像之类的
			wx.getUserInfo({
				success: function (result) {

					var userInfo = result.userInfo;
					var nickName = userInfo.nickName;
					var avatarUrl = userInfo.avatarUrl;

					var u = Bmob.Object.extend("_User");
					var query = new Bmob.Query(u);
				// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
				query.get(user.id, {
					success: function (result) {
					// 自动绑定之前的账号
					result.set('userInfo', {
						nickname: nickName,
						avatar: avatarUrl
					});
					// result.set('nickName', nickName);
					// result.set("userPic", avatarUrl);
					// result.set("openid", openid);
					result.save();

				}
			});

			}
		});
		}, function (err) {
			console.log(err, 'errr');
		});
			}
		});
	},
	loadSeller: function (cb) {
		var query = new Bmob.Query('Seller');
		query.find().then(function (sellerObjects) {
			var seller = sellerObjects[0];
			cb(seller);
		});
	},
	payment: function (order) {
		// 微信支付
		var openId = Bmob.User.current().get('authData').weapp.openid;
		//传参数金额，名称，描述,openid
		Bmob.Pay.wechatPay(order.get('total'), '洗鞋', '订餐', openId).then(function (resp) {
			console.log('resp');
			console.log(resp);
			//服务端返回成功
			var timeStamp = resp.timestamp,
			nonceStr = resp.noncestr,
			packages = resp.package,
			orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
			sign = resp.sign;
			//打印订单号
			console.log(orderId);
			//发起支付
			wx.requestPayment({
				'timeStamp': timeStamp,
				'nonceStr': nonceStr,
				'package': packages,
				'signType': 'MD5',
				'paySign': sign,
				'success': function (res) {
					//付款成功,这里可以写你的业务代码
					console.log(res);
					// 写入订单号，更新订单状态
					order.set('sn', orderId);
					order.set('status', 1);
					order.save().then(function () {
						wx.showModal({
							title: '支付成功',
							showCancel: false,
							success: function () {
								// 跳转订单详情页
								wx.navigateTo({
									url: '/order/detail/detail?objectId=' + order.id
								});
							}
						});
					}, function (res) {
						console.log(res);
						wx.showModal({
							title: '更新订单失败'
						});
					});
				},
				'fail': function (res) {
					wx.showModal({
						title: '支付取消',
						showCancel: false,
						success: function () {
							wx.navigateTo({
								url: '/order/detail/detail?objectId=' + order.id
							});
						}
					});
				}
			})
		}, function (err) {
			console.log('服务端返回失败');
			console.log(err.message);
			console.log(err);
		});
	},


  myurl: 'https://wwx.50cms.com:446/',
  domain: 'https://wwx.50cms.com:446/apiww',
    //domain: 'http://192.168.1.205:8800',

  /* ------------- ------------- 全局数据存储 -------------------------- */
  globalData: {
    userOpenid: null,
    userLocation: '121,213',
    userAddress: '昆明市中心',
    map: null,
    introduce: null,
    latitude: null,
    longitude: null,
    personInfo:null,
    userInfo: null,
    navBarHeight: 0, // 导航栏高度
     menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
		menuHeight: 0,// 胶囊高度（自定义内容可与胶囊高度保
		orderactive:0
  },
  userInfo: {
    UOpenID         : null,        // 用户唯一标识
    status          : null,           // 状态信息 1:绑定过,0:未绑定
    potentialMember : null,           // 是否为潜在会员 0:不是潜在会员,1:是潜在会员
    isMember        : null,           // 是否是会员 1:是会员,0:不是会员
    tongMember      : null,           // 是否是通卡会员 1:是通卡会员,0:不是通卡会员
    memberId        : null,           // 会员id
    baseInfo        : null,           // 是否录入过基本信息 1:录入过,0:没有录入过
    storeId         : null,        // 会员归属门店
    userPhone       : null,      // 绑定手机号
    Uname:null,
    UNickName:null,
	},
	userModel: userModel,
  indexModel: indexModel,
  commonModel: commonModel,

  shopModel:shopModel



})
