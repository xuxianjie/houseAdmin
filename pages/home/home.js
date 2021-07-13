const http =require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';

Page({


  data: {

  },
  // 获取轮播图
  getCarousel: function () {

    http.get('/api/carousel-picture', {
      type: 'home'
    }).then(res => {
      if(!res.errCode){
        this.setData({
          carouselList: res.data
        })
      }
    })
  },

  onLoad: function (options) {
    
  },
  goWriteRecord(){
    wx.navigateTo({
      url: '/pages/writeRecordList/writeRecordList',
    })
  },
  getImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success:res=>{
        let files = res.tempFilePaths
        // 上传图片
        wx.cloud.uploadFile({
          cloudPath:'XJ'+new Date().getTime(),
          filePath:res.tempFilePaths[0],
          success:res=>{
            console.log(res)
          },
          fail:res=>{
            console.log(res)
          }
        })
      }
    })
  },
  getList(){
    wx.cloud.callFunction({
      name:"getData",
      data:{
        pageIndex:2,
        pageSize:10
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        list:res.result
      })
    })
  
  },
  addGoods(data){
    wx.cloud.callFunction({
      name:"addGoods",
      data
    }).then(res=>{
      console.log(res)
      this.getList()
    })

  },
  onReady: function () {

  },
  

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})