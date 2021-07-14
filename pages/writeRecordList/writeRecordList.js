const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
import Toast from '@vant/weapp/toast/toast';

Page({


  data: {
    householdListOne: [],
    householdListTwo: [],
    loading: false,
    popupBool: false
  },


  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('user').userId
    })
  },

  onShow: function () {
    this.getWriteRecordList()
  },
  // 提交
  submit(){
    wx.showModal({
      title:'确认提交吗',
      content:'请确认填写完毕？',
      success:async res=>{
        if(res.confirm){
          const householdList = [...this.data.householdListOne,...this.data.householdListTwo]
          const result =await wx.$http.add('record',{householdList})
          console.log(result)
          if(wx.$http.getMsg(result.errMsg)){
            wx.showToast({
              title: '提交成功',
            })
            wx.navigateBack({
              delta: 0,
            })
          }else{
            wx.showToast({
              title: result.errMsg,
            })
          }
        }
      }
    })
  },
  // 输入
  inputKind(e){
    const {type,index,building} = e.currentTarget.dataset
    const array = building === 1? this.data.householdListOne:this.data.householdListTwo
    array[index]['current'+type] = parseInt(e.detail.value) 
    if(type == 'water'){
      array[index]['currentWater'] = parseInt(e.detail.value) 
    }else{
    array[index]['currentElectric'] = parseInt(e.detail.value) 
    }
    if(building === 1){
      this.setData({
        householdListOne:array
      })
    }else{
      this.setData({
        householdListTwo:array
      })
    }

  },
  // 获取订单
  getWriteRecordList: function () {
    // 设置节流阀
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })

    // 加载提示
    Toast.loading({
      title: '加载中',
      loadingType: 'spinner',
      duration: 0
    })
    // 传入 isFirst   是否加载第一页
    // 当首次加载 则pageNum=1
    return wx.$http.get('household').then(res => {
      if (!res.errCode) {
        Toast.clear()
        console.log(res)
        const householdListOne = res.result.filter(item => { return item.building === 1 })
        const householdListTwo = res.result.filter(item => { return item.building === 2 })
        this.setData({
          householdListOne,
          householdListTwo
        })
        //  可以再次加载
        this.setData({
          loading: false
        })
      } else {
        Toast.clear()
        Toast.fail('加载失败')
        this.setData({
          loading: false
        })
      }
    }).catch(err => {
      Toast.clear()
      Toast.fail('系统繁忙')
      console.log(err)
      this.setData({
        loading: false
      })
    })
  },
  // 弹出框开启关闭
  openPopup: function (e) {
    this.setData({
      popupBool: true
    })
  },
  showPopup: function (e) {
    this.setData({
      popupBool: !this.data.popupBool
    })
  },

  onPullDownRefresh: function () {

    this.getWriteRecordList().then(res => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })

  },



  onReachBottom: function () {
    // 判断是否还有更多
    if (this.data.writeRecordList.length < this.data.pageCount) {
      this.data.pageNum++
      this.getWriteRecordList()
    }
  },


  onShareAppMessage: function () {

  },
})
