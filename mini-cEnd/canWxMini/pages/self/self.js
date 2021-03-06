import canHost from '../../config/interface.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dateMentInfos: [{ "name": "1111111" }, { "name": "2222222" }]
  },
  //事件处理函数  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var that = this
    wx.request({
      url: canHost.miniHost +'wx/business/getMyDatements?sessionId=' + wx.getStorageSync("miniSessionId"),
      method: "POST",
      data:{},
      success: function (result) {
        that.setData({
          dateMentInfos: result.data.data
        })
        console.log(result.data.data)

      }
    })


  },
  bindViewEvent: function (e) {
    app.process(this, e)

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: false
    // })

    wx.login({
      success: function (res) {
        console.log(res.code)
        var code = res.code
        wx.request({
          url: canHost.miniHost +'wx/mini/doLogin?code=' + code,
          method: "POST",
          success: function (result) {
            console.log(result)
          }
        })
      }
    })

  },
  //获取详情
  getDetail:function(e){
    var value = e.currentTarget.dataset.value
    wx.request({
      url: canHost.miniHost +'wx/business/getDateDetail?sessionId=' + wx.getStorageSync("miniSessionId"),
      method: "POST",
      data: { dateMentId:value},
      success: function (result) {        
        console.log(result.data.data)
        wx.navigateTo({
          url: '../dateMentDetail/dateMentDetail?current=' + JSON.stringify(result.data.data)
        })
      }
    })
  }


})
