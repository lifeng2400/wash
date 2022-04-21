import { Security } from '../utils/security.js'
import { request } from '../utils/http.js'

class ShopModel extends Security {


  goodindex() { // 获取列表
    let url = '/index.ashx'
    return this.request({ url: url})
    
  }

  goodsdetail(data) { // 获取列表
    let url = '/goods/detail.ashx'
    return this.security({ url: url, data: data ,method: 'POST'})
  }

  
  nearindex(type="all",lon,lat,page_index, page_size ) { // 获取列表
    let url = `/goods/near.ashx`
    return this.security({ url: url, data: {type:type,lon,lat, page_index: page_index, page_size: page_size },method: 'POST' })
  }


  getAnswerCommentList({ a_id, page_index = 1, page_size = 10 }) { // 获取回答评论列表
    let url = `/answer/comment/${a_id}`
    return this.security({ url: url, data: { page_index: page_index, page_size: page_size } })
  }

  orderList({type="all", page_index = 1, page_size = 10 }) { // 获取列表
    let url = `/order/index.ashx`
    return this.security({ url: url, data: {type:type, page_index: page_index, page_size: page_size } })
  }

  hotledetail(hid) { // 获取列表
    let url = '/goods/hotledetail.ashx'
    return this.security({ url: url, data: {hid:hid} })
  }



   addOrder(data) { // 添加订单
    let url = '/order/createOrder.ashx'
    return this.security({ url: url, data: data, method: 'POST' })
  }
  
  getOrderDetail(data) { // 订单详细
    let url = '/order/detail.ashx'
    return this.security({ url: url, data: {oid:data}, method: 'POST' })
  }

  getOrder(data) { // 主订单 支付使用 
    let url = '/order/getOrder.ashx'
    return this.security({ url: url, data: {oid:data}, method: 'POST' })
  }

  classifyList(data) { // 获取列表
    let url = `/goods/classify.ashx`
    return this.security({ url: url, data:data , method: 'POST'})
  }

   wxpay(app, money, orderId, redirectUrl) {

    wx.showLoading({
      title: '加载中...',
    });
    let remark = "在线充值";
    let nextAction = {};
    if (orderId != 0) {
      remark = "支付订单 ：" + orderId;
      nextAction = { type: 0, id: orderId };
    }
    let data={
      paramJson: JSON.stringify({ 
        money:money,
        remark: remark,
        orderId:orderId,
        payName:"在线支付",
        nextAction: nextAction,
       
    })}
    let url = '/pay/pay.ashx';
    this.security({ url: url, data:data, method: 'POST' }).then(res => {
      wx.hideLoading();
      if (res.code == 1) {
console.log("res",res)

        wx.requestPayment({
          timeStamp:res.data.pay_data.timeStamp,
          nonceStr:res.data.pay_data.nonceStr,
          package: res.data.pay_data.package,
          signType:'MD5',
          paySign:res.data.pay_data.paySign,
          fail:function (aaa) {
            wx.showToast({title: '支付失败:' + aaa})
          },
          success:function () {
            wx.showToast({title: '支付成功'})
            wx.reLaunch({
              url: redirectUrl
            });
          }
        })
      }
         else {

          wx.showToast({ title: '服务器忙' + res.data.code + res.data.msg})
         }
    });

  }
  

}

export const shopModel = new ShopModel()