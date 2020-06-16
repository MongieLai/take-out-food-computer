//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInput: [0],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    resultFee: [], //{name:'1',fee:100}
    resultVisible: false,
    totalPrice: 0
  },
  onSubmit(e) {
    let data = e.detail.value
    let recordList = []
    let totalPrice = 0
    let {
      freight,
      packingFee,
      discount
    } = data
    for (let key in data) {
      if (key.indexOf('user') >= 0) {
        recordList.push({
          value: parseFloat(data[key])
        })
        totalPrice += parseFloat(data[key])
      }
    }
    this.setData({
      totalPrice
    })
    let op = []

    recordList.map(record => {
      discount = parseFloat(discount) || 0
      freight = parseFloat(freight) || 0
      packingFee = parseFloat(packingFee) || 0
      record.discount = record.value / totalPrice
      discount > 0 && (record.value -= record.discount * discount)
      freight > 0 && (record.value += freight / recordList.length)
      packingFee > 0 && (record.value += packingFee / recordList.length)
      op.push(record.value.toFixed(2))
    })
    console.log(recordList)
    let o
    if (!this.data.resultVisible) {
      o = !this.data.resultVisible
    }
    console.log()
    this.setData({
      resultVisible: o,
      resultFee: op
    })
    console.log(this.data)
  },
  removeUser() {
    let userInput = this.data.userInput
    if (userInput.length > 1) {
      userInput.pop()
      this.setData({
        userInput: this.data.userInput
      })
    } else {
      wx.showToast({
        title: '不可再删除',
        icon: "none"
      })
    }
  },
  onClick: function (event) {
    let that = this.data
    this.setData({
      userInput: that.userInput.concat(0)
    })

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
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
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})