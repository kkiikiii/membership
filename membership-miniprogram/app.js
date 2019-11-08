/* 参考https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html */
import UserService from './dataservice/UserService.js'
var userService = new UserService()
App({
  /**
   * 生命周期回调——监听小程序初始化。
   */
  onLaunch: function() {
    //云开发基础库要求2.2.3 或以上
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'weather-4g743'
      })
    }

    //使用云函数获取用户openid，用户是否被锁定
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res)
        this.globalData.isLocked = res.result.isLocked
        this.globalData.openid = res.result.openid

        userService.isExist(
          res.result.openid,
          function(res) {
            
            if (res.data.length == 0) {
              
              console.log("createUser", res)
              wx.cloud.callFunction({
                name: 'createUser',
                data: {},
                success: res => {
                  console.log("createuser", res)
                }
              })
            }else{
              console.log("用户已经存在")
            }
          }
        )
      },
      fail: err => {
        console.log(err) //跳转出错页面
        wx.redirectTo({
          url: '/pages/membership/pages/errorpage/errorpage'
        })
      }
    })
  },
  //小程序全局变量
  globalData: {
    openid: null,
    isLocked: null
  }
})