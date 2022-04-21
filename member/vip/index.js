var that;

Page({

  data: {
    personCountIndex: 0,
    vipType:0
	},
	onLoad: function () {
		that = this;

  },
  showShare:
  function () {
		that = this;

  },


  onShareAppMessage: function()
  {
    return {
      title: "工厂洗，更放心",
      path:"shop/menu/menu?oid=123",
      imageUrl:"http://xzmm.50cms.com/up/one.jpg"
    }
  },



}) 