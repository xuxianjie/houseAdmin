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
        res.result.forEach(item => {
            let waterPrice = item.name === '2楼'?  6 : 7
            let electricPrice = item.name === '2楼'? 1 :1.2
            item.useElectric = item.electric - item.lastElectric
            item.useWater = item.water - item.lastWater
            item.useElectricPrice = Math.round(electricPrice*item.useElectric)
            item.useWaterPrice = Math.round( waterPrice*item.useWater)
            item.allPrice = item.rent+item.useElectricPrice+item.useWaterPrice+item.tvPrice+item.adminPrice+item.clearPrice+item.netPrice
        });
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
  showDetail(e){
    console.log(e)
    const detail = e.currentTarget.dataset.detail
    let index = this.data.householdListOne.findIndex(item=>{return item.name == detail.name})
    if(index === -1){
      index = this.data.householdListTwo.findIndex(item=>{return item.name == detail.name})
      this.data.householdListTwo[index].isTap = true
      this.setData({
        householdListTwo:this.data.householdListTwo
      })
    }else{
      this.data.householdListOne[index].isTap = true
      this.setData({
        householdListOne:this.data.householdListOne
      })
    }

    this.setData({
      detail,
      popupBool:true
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


  onShareAppMessage: function () {

  },
})
