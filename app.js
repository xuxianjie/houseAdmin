
App({
  onLaunch: function () {
    wx.cloud.init({
      env:'prod-5gzqpk7480d92afc'
    })
  },
  globalData: {
   buildingStr:{
     1:'四巷13号',
     2:'五巷15号',
   }
  }
})