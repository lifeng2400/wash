var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
var that;
const app = getApp()
Page({

    data: {
        visual:'hidden',
        aid:0
	},
	onLoad: function (options) {
        that = this;
        // 注册通知
        WxNotificationCenter.addNotification("poiSelectedNotification",that.getAddress,that);
        // 属于编辑状态
        if (options.objectId) {
            that.loadAddress(options.objectId);
            that.setData({
                isEdit: true,
                aid:options.objectId,
               
            });
            wx.setNavigationBarTitle({
                title: '编辑地址'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '添加地址'
            })
        }
	},
	selectAddress: function () {
        console.log('tapped')
        // 跳转选择poi
		wx.navigateTo({
			url: '../search/search'
		});
	},
    getAddress: function (area) {
        // 选择poi地址回调
        that.setData({
            area: area
        });
    },
    add: function (e) {
        var form = e.detail.value;
        // console.log(form);
        // 表单验证
        if (form.realname == '') {
            wx.showModal({
                title: '请填写收件人姓名',
                showCancel: false
            });
            return;
        }

        if(!(/^1[34578]\d{9}$/.test(form.mobile))){ 
            wx.showModal({
                title: '请填写正确手机号码',
                showCancel: false
            });
            return;
        }

        if (form.detail == '') {
            wx.showModal({
                title: '请填写详细地址',
                showCancel: false
            });
            return;
        }

        form.gender = parseInt(form.gender);
      //  form.user = Bmob.User.current();
     //   var address = new Bmob.Object('Address');
        // 是否处在编辑状态
        if (that.data.isEdit) {
          //  address = that.data.address;
        }     
        var name =form.realname;
        var iphone =form.mobile;
        var addre = form.detail ;
        var isactive = form.gender;
        var title=this.data.area.title;
        var address=this.data.area.address;
        var location=this.data.area.location;
        var addname=this.data.area.addname;
        var aid=that.data.aid;
        let  tdata={
          paramJson: JSON.stringify({
            name:name,
            iphone:iphone,
            addre:addre,
            isactive:isactive,
            title:title,
            address:address,
            location:location,
            addname:addname,
            id:aid
          })
        };
        wx.showLoading({ title: '保存中...' });
        app.userModel.addreAdd(tdata).then(res => {
          wx.hideLoading();
          if (res.code == 1) {
            wx.showToast({
              title: res.msg,
              duration: 1500
            })
            setTimeout(_ => {
                wx.navigateBack();
            }, 1500)
          }
    
        })

        // address.save(form).then(function (res) {
        //     // console.log(res)
        //     wx.showModal({
        //         title: '保存成功',
        //         showCancel: false,
        //         success: function () {
        //             wx.navigateBack();
        //         }
        //     });
        // }, function (res) {
        //     // console.log(res)
        //     wx.showModal({
        //         title: '保存失败',
        //         showCancel: false
        //     });
        // });
    },
    loadAddress: function (objectId) {
    	app.userModel.getAddress(objectId).then(res => {
			if (res.code == 1) 
			{
				that.setData({
                    address: res.data,
                    area:res.data.area
				});
			} 
		})
    },
    delete: function () {
        // 确认删除对话框
        wx.showModal({
            title: '确认删除',
            success: function (res) {
                if (res.confirm) {
                    var address = that.data.address;
                    address.destroy().then(function (result) {
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
        
    }
})