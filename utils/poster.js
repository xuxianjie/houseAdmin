import Wxml2Canvas from 'wxml2canvas'; 

let poster={

  drawPoster : function (canvasId,width,height) {
    return new Promise((resolve,reject)=>{
      let self = this;
      // console.log('aaa')
      wx.showLoading({
        title: '绘制中',
      })
      this.drawImage1 = new Wxml2Canvas({
        width: width, // 宽， 以iphone6为基准，传具体数值，其他机型自动适配
        height: height, // 高
        element: canvasId,
        // background: '#4286FD',
        progress(percent) {
          // 显示进度
          console.log(percent)
          if (percent == 100) {
            wx.hideLoading()
          }
        },
        finish(url) {
          resolve(url)
        },
        error(res) {
          console.log(res)
          reject(res)
        }
      });

      let data = {
        list: [{
          type: 'wxml',
          class: '.share_canvas .draw', // draw_canvas指定待绘制的元素
          limit: '.share_canvas', // 限定绘制元素的范围，取指定元素与它的相对位置
          x: 0,
          y: 0
        }]
      }

     this.drawImage1.draw(data);
    })
  }
}



module.exports = poster
