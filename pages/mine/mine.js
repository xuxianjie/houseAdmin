const http = require('../../utils/http.js')
import toast from '@vant/weapp/toast/toast'
Page({


  data: {
    user:null
  },
  getUser:function(){
   
  },
  onLoad: function (options) {

  },

  onShow: function () {
    this.getUser()
  },


})