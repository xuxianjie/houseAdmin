const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
const check = require('../../utils/check.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')

Page({


  data: {
    open: {}
  },
  //redio
  changeSome(e){
    let type = e.currentTarget.dataset.type
    this.data.open[type] = e.detail
    this.setData({
      open: this.data.open
    })
  },

  //input===== set指定字段数据到open中
  inputSome(e) {
    let type = e.currentTarget.dataset.type
    this.data.open[type] = e.detail.value
    this.setData({
      open: this.data.open
    })
  },

  //picker==== set指定对象到data
  pickerSome(e) {
    let type = e.currentTarget.dataset.type
    let obj = this.data[type + 'list']
    this.setData({
      [type]: obj
    })
  },
  getopen: function(openId) {
    return wx.$http.res['_interFace'].getById(openId).then(res => {
      if (!res.errCode) {
        if (res.data) {
          //  0 =>'0'
          for (let i in res.data) {
            if (res.data[i] === 0) {
              res.data[i] = res.data[i] + ''
            }
          }
          res.data.imageUrls = this.reverseImageUrls(res.data.imageUrls)
          this.setData({
            open: res.data
          })
        }
      } else {
        Toast.fail({
          title: res.errMsg
        })
      }
    }).catch(err => {
      console.log(err)
      Toast.fail('系统繁忙')
    })
  },

  postInfo: function(e) {

    // 加载提示
    Toast.loading({
      message: '加载中',
      loadingType: 'spinner',
      duration: 0,
      forbidClick: true
      // 禁止点击
    })
    var params = e.detail.value

    // ios不支持  2018-10-10 18:00  的格式转化为Date 需要转换为为 2018/10/10 18:00
    // let enterDeadline = new Date(this.data.deadline.replace(/-/g, '/')).getTime()

    // 获取到的时间为  当天的 8：00 取0点需要另外设置
    // startTime: new Date(this.data.startTime).getTime() - 28800000, 
    // endTime: new Date(this.data.endTime).getTime() + 57540000, 
    if (this.data.type == 'create') {
      wx.$http.post('/api/open', params).then(res => {
        if (!res.errCode) {
          Toast.clear()
          Toast.success('创建成功')
          wx.navigateBack({

          })
        } 
      })
    } else {
      wx.$http.put('/api/open', params).then(res => {
        if (!res.errCode) {
          Toast.clear()
          Toast.success('修改成功')
          wx.navigateBack({

          })
        } 
      })
    }

  },

  onLoad: function(options) {
    this.setData({
      type: options.type,
      userId: wx.getStorageSync('user').userId,

    })
    this.cropper = this.selectComponent("#image-cropper");
    if (options.type == 'change') {
      wx.setNavigationBarTitle({
        title: '',
      })
      this.getopen(options.openId).then(() => {

      })
    }
  },
  // 返回数据数组转换
  reverseImageUrls: function (imageUrls) {
    if (imageUrls && typeof imageUrls == 'string' && imageUrls.length > 0) {
      try {

        return JSON.parse(imageUrls);
      } catch (e) {

        return imageUrls.split(',');
      }
    } else {
      return imageUrls
    }
  },
  // 获取 年月日时分的picker数组
  getTimeObj() {
    // 获取时间 YMDhm time为当前时间
    let timeObj = dateTimePicker.dateTimePicker(new Date().getFullYear(), 2050)
    this.setData({
      timeArray: timeObj.dateTimeArray,
      nowTime: timeObj.dateTime
    })
  },
  // picker YMDhm修改详细时间
  changeRefundDeadline: function(e) {
    let time = e.detail.value
    let timeArray = this.data.timeArray
    this.setData({
      refundDeadline: `${timeArray[0][time[0]]}-${timeArray[1][time[1]]}-${timeArray[2][time[2]]} ${timeArray[3][time[3]]}:${timeArray[4][time[4]]}`
    })
  },
  // 获取一张图片
  getImage: function() {
    wx.chooseImage({
      count: 1, //根据imagelist长度 控制可添加的图片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.uploadFile({
          url: http.config.baseUrl + "/api/upload-image",
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            type: "trip"
          },
          header: http.config.header,
          success: res => {
            let data = JSON.parse(res.data);
            this.data.open.imageUrl = data.data;
            this.setData({
              open: this.data.open
            })
          }
        })
      }
    })
  },
  getImage: function() {
    wx.chooseImage({
      count: 1, //根据imagelist长度 控制可添加的图片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          cropperBool:true,
          src:res.tempFilePaths[0]
        })
    
          // 可直接调用自动裁剪
          // this.cropper.getImg(data=>{
          //   console.log(data.url)
          // })
  
 
      }
    })
  },
  // 获取多张图片
  getImageList: function() {
    let count = 3 - this.data.imageList.length
    wx.chooseImage({
      count: count, //根据imagelist长度 控制可添加的图片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // 

        res.tempFilePaths.forEach(item => {
          wx.uploadFile({
            url: http.config.baseUrl + "/api/upload-image",
            filePath: item,
            name: 'file',
            formData: {
              type: "trip"
            },
            header: http.config.header,
            success: res => {
              let data = JSON.parse(res.data);

              this.data.open.imageUrls.push(data.data);
              this.setData({
                open: this.data.open
              })
            }
          })
        })
      }
    })
  },
  // 删除一张图片
  deleteImage(e) {
    this.setData({
      ['open.imageUrl']: null
    })
  },
  cropperCancel(e){
    this.setData({
      cropperBool:false
    })
  },
  cropperConfirm(e){
    this.cropper.getImg((obj)=>{
;
      console.log( obj.url)

    });
  },
  // 删除多张图片
  deleteImages(e) {
    this.data.open.imageUrls.splice(e.target.dataset.index, 1)
    this.setData({
      open: this.data.open
    })
  },
})