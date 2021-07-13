// show:组件是否显示
// bindoverly 点击遮罩层 和关闭按钮--- 组件通信
// bindload 点击授权后 调用的方法---组件通信


// 
/**使用条件
 *  1.wxml页面放入 <login></login>
  <login show="{{showBool}}" data-name="{{show}}" bindoverly="closeLogin" bindload="load"></login>
 *
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{ //是否显示
      type:Boolean,
      value:false
    },
    back:{
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    login: function (e) {
      // console.log(this.data)
      // console.log(this.properties)
      // this.properties.show=false

      console.log(this.data)
      console.log(this.properties)
      this.triggerEvent('load', {}, {})

      if (!e.detail.userInfo) {
        console.log(e)
        return
      }
      console.log(wx)
      wx.$http.post("/api/user-wx", {
        openId: wx.getStorageSync("openId"),
        userName: e.detail.userInfo.nickName,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city,
        gender: e.detail.userInfo.gender,
        avatarUrl: e.detail.userInfo.avatarUrl
      }).then((res) => {
        if (!res.errCode) {
          this.setData({
            show: false
          })
          wx.setStorageSync("user", res.data);
         this.triggerEvent('load',{},{})
        } 
      })
    },
   overlyTap(){

      this.triggerEvent('overly',{},{})

    }
  }
})
