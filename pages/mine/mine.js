const http = require('../../utils/http.js')
import toast from '@vant/weapp/toast/toast'
Page({


  data: {
    user:null
  },
  getUser:function(){
    http.get(`/api/user/${wx.getStorageSync('user').userId}`).then(res => {
      if(!res.errCode){
        this.setData({
          user:res.data
        })
      }else{
        toast.fail({
          message:'系统错误',
          duration:1500
        })
      }
    })
  },
  onLoad: function (options) {

  },

  onShow: function () {
    this.getUser()
  },


})