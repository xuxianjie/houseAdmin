const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';

Page({


  data: {

  },
  // 获取轮播图
  getCarousel: function () {

    http.get('/api/carousel-picture', {
      type: 'home'
    }).then(res => {
      if (!res.errCode) {
        this.setData({
          carouselList: res.data
        })
      }
    })
  },

  onLoad: function (options) {

  },
  goWriteRecord() {
    wx.navigateTo({
      url: '/pages/writeRecordList/writeRecordList',
    })
  },
  getImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let files = res.tempFilePaths
        // 上传图片
        wx.cloud.uploadFile({
          cloudPath: 'XJ' + new Date().getTime(),
          filePath: res.tempFilePaths[0],
          success: res => {
            console.log(res)
          },
          fail: res => {
            console.log(res)
          }
        })
      }
    })
  },
  getList() {
    wx.cloud.callFunction({
      name: "getData",
      data: {
        pageIndex: 2,
        pageSize: 10
      }
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.result
      })
    })

  },
  async addGoods() {
    let arr = [{
      name: "101",
      rent: 0,
      electric: 2681,
      water: 268,
    },
    {
      name: "102",
      rent: 400,
      electric: 5939,
      water: 827,
    },
    {
      name: "2楼",
      rent: 0,
      electric: 27238,
      water: 3063,
    },
    {
      name: "301",
      rent: 1400,
      electric: 5662,
      water: 687,
    },
    {
      name: "302",
      rent: 1300,
      electric: 1675,
      water: 918,
    },
    {
      name: "303",
      rent: 2000,
      electric: 7247,
      water: 2121,
    },
    {
      name: "304",
      rent: 1600,
      electric: 5216,
      water: 1200,
    },
    {
      name: "401",
      rent: 1400,
      electric: 4462,
      water: 808,
    },
    {
      name: "402",
      rent: 8417,
      electric: 8417,
      water: 1248,
    },
    {
      name: "403",
      rent: 2100,
      electric: 7217,
      water: 1268,
    },
    {
      name: "404",
      rent: 1650,
      electric: 8196,
      water: 928,
    },
    {
      name: "501",
      rent: 1300,
      electric: 2388,
      water: 467,
    },
    {
      name: "502",
      rent: 1300,
      electric: 8535,
      water: 1528,
    },
    {
      name: "503",
      rent: 2000,
      electric: 8535,
      water: 1528,
    },
    {
      name: "504",
      rent: 1650,
      electric: 1671,
      water: 1829,
    },
    {
      name: "601",
      rent: 1300,
      electric: 8876,
      water: 1293,
    },
    {
      name: "602",
      rent: 1300,
      electric: 6099,
      water: 572,
    },
    {
      name: "603",
      rent: 2000,
      electric: 6180,
      water: 897,
    },
    {
      name: "604",
      rent: 1500,
      electric: 1727,
      water: 770,
    },
    {
      name: "701",
      rent: 1250,
      electric: 7456,
      water: 7438,
    },
    {
      name: "702",
      rent: 1400,
      electric: 7245,
      water: 839,
    },
    {
      name: "703",
      rent: 1800,
      electric: 8191,
      water: 1366,
    },
    {
      name: "704",
      rent: 1600,
      electric: 6144,
      water: 937,
    },
    {
      name: "801",
      rent: 1200,
      electric: 7736,
      water: 664,
    },
    {
      name: "802",
      rent: 1600,
      electric: 2197,
      water: 898,
    },
  ]
  var arr2 = [
    {
      name: "102",
      rent: 4000,
      electric: 9127,
      water: 37,
    },
    {
      name: "201",
      rent: 1900,
      electric: 774,
      water: 395,
    },
    {
      name: "202",
      rent:2100 ,
      electric: 9015,
      water: 1417,
    },
    {
      name: "203",
      rent: 1100,
      electric: 5602,
      water:129 ,
    },
    {
      name: "3楼",
      rent: 4000 ,
      electric: 13625 ,
      water: 779,
    },
    {
      name: "4楼",
      rent: 4800,
      electric: 10622,
      water:755 ,
    },
    {
      name: "5楼",
      rent: 4000 ,
      electric: 4163 ,
      water: 795 ,
    },
  ]
  arr2=arr2.map(item=>{
    let temp = {...item, lastElectric: item.electric,
      lastWater: item.water,
      tvPrice: 0,
      adminPrice: 0,
      clearPrice: 0,
      netPrice: 0,
      building: 2}
      if(item.name === '102'){
        item.clearPrice = 60
      }
    return temp
  })
 
    const result = await wx.$http.add('household', {
      householdList:arr2
    })
    console.log(result)

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