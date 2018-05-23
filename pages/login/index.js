const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    msg: ''
  },
  formSubmit(e) {
    let user = e.detail.value.user;
    let password = e.detail.value.password;
    if (user != '' && password != '') {
      let params = {
        mobile: user,
        password: password,
        flag: 2
      }
      app.api.login(params).then(res => {
        if (res.code === 1000) {
          // 同步方式存储表单数据
          wx.setStorageSync('authorization', res.data.authorization);
          wx.setStorageSync('loginId', res.data.loginId);
          wx.setStorageSync('user', res.data.user);
          app.utils.getUserInfo(app);
          wx.login({
            success(data) {
              app.api.getOpenId({ code: data.code }).then(res => {
                if (res.code === 1000) {
                  // console.log("wx.login回调成功：" + res.data)
                  wx.setStorageSync('openId', res.data);
                }
              })
            }
          })
          //跳转到成功页面
          wx.reLaunch({
            url: '../index/index'
          })
        } else {
          this.setData({
            errorMsg: true,
            msg: res.message
          })
        }
      })
    } else {
      this.setData({
        errorMsg: true,
        msg: '手机号码或密码不能为空'
      })
    }
  },
  //  校验手机号密码不能为空
  checkValue(e, types) {
    if (e.detail.value == '') {
      if (types === 1) {
        this.setData({
          errorMsg: true,
          msg: '手机号码不能为空'
        })
      } else {
        this.setData({
          errorMsg: true,
          msg: '密码不能为空'
        })
      }
    } else {
      this.setData({
        errorMsg: false,
        msg: ''
      })
    }
  },
  userHandle(e) {
    this.checkValue(e, 1)
  },
  passwordHandle(e) {
    this.checkValue(e, 2)
  },
  onHide() {
    app.utils.fireIds(app.formIds, app);
  }
})