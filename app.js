/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat.js')

/**

 *  API 模块
 * @type {Object}
 */

const api = require('./utils/api.js')
const utils = require('./utils/util.js')


//app.js
App({
  wechat: wechat,
  api: api,
  utils: utils,
  formIds: [],
  userInfo:{},
  buserInfo: {},
  role: '' //vip最牛b，admin一般般牛b，offer小组长，business干活的，normal杂碎
})

const app = getApp();
// 获取个人信息
app.utils.getUserInfo(app);
// 获取openid
let openId = wx.getStorageSync('openId');
if (!openId || openId == '') {
  // console.log("开始请求wx.login")
  wx.login({
    success(data) {
      if (!wx.getStorageSync('authorization')) return
      app.api.getOpenId({ code: data.code }).then(res => {
        if (res.code === 1000) {
          // console.log("wx.login回调成功：" + res.data)
          wx.setStorageSync('openId', res.data);
        }
      })
    }
  })
}
