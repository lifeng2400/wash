import { Security } from '../utils/security.js'
import { config } from "../config.js"
const regeneratorRuntime = require('../utils/runtime.js')

class CommonModel extends Security {
  async uploadFile(filePath) { // 上传文件
    let url = `${config.api_base_url}/common/upload.ashx`
    let header = await this.getHeader()
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url,
        name: 'file',
        filePath: filePath,
        header: header,
        success: res => {
   
          if(res.statusCode !== 200) {
            return reject(res);
          }          
          let filepath = JSON.parse(res.data).filepath    
          resolve(filepath)
        },
        fail: reject
      })
    })
  }

  // 获取标签列表
  async getTags() {
    let url = '/common/tags';
    return this.security({ url });
  }

  // 生成二维码
  async createQRCode(data = {}) {
    let url = '/common/qrcode';
    return this.security({ url, method: 'POST', data })
      .then(res => {
        let filepath = res.data.qrcode_path;
        return `${config.img_base_url}/${filepath}`;
      });
  }

  authPhoneNum(data = {}) { // 授权添加手机号码
    let url = '/wx/cphonenum.ashx'
    return this.security({ url, method: 'POST', data })
  }

  writeForm(formId) { // 存储formId
    let url = `/common/writeform/${formId}`
    return this.security({ url, method: 'POST' })
  }
}

const commonModel = new CommonModel()

export default commonModel