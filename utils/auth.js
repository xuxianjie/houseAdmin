var http = require("http.js")

var getUser = function () {
  var user = wx.getStorageSync('user');
  if (user && user.token) {
    return user;
  } else {
    //跳转到登录页
    wx.redirectTo({
      url: "../grant/grant"
    });
  }
};

var getOpenId = function (resolve, reject) {
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      http.post("/api/user-auth-by-code", { code: res.code }).then(res => {
        if (!res.errCode) {
          wx.removeStorageSync('user');
          wx.setStorageSync('openId', res.data.openId);
          if (res.data.token) {
            wx.setStorageSync("user", res.data);
            if (getCurrentPages().length) {
              let pageUrl = getCurrentPages()[getCurrentPages().length - 1].route;
              let arr = pageUrl.split("/");
              if (arr[arr.length - 1] == "login") {
                wx.switchTab({
                  url: '../index/index'
                })
              }
            }
            resolve(res.data);
          }else{
            wx.redirectTo({
              url: '../login/login'
            })
          }
        } else{
          wx.redirectTo({
            url: '../login/login'
          })
          wx.showToast({
            title: res.errMsg,
            icon: "none",
            duration: 3000
          })
        }
      }, error => {
        reject(error);
      })
    }
  })
};

var getUserInfo = function () {
  wx.getSetting({
    success: res => {
      if (res.authSetting["scope.userInfo"]) {
        wx.getUserInfo({
          success: res => {
            this.globalData.userInfo = res.userInfo
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    }
  })
};

var getUserLocation = function (resolve, reject) {
  wx.authorize({
    scope: "scope.userLocation",
    success: res => {
      wx.getLocation({
        success: location => {
          resolve(location);
        },
        fail: error => {
          reject(error);
        }
      })
    },
    fail: error => {
      reject(error);
    }
  })
};

var checkUser = function (pageObj) {
  if (pageObj.onLoad) {
    let _onLoad = pageObj.onLoad;
    // 使用onLoad的话需要传递options
    pageObj.onLoad = function (options) {
      if (wx.getStorageSync('user') && wx.getStorageSync('user').token) {
        // 获取当前页面
        let currentInstance = getPageInstance();
        _onLoad.call(currentInstance, options);
      } else {
        //跳转到登录页
        if (options && options.scene) {
          wx.redirectTo({
            url: "/pages/login/login?higherUserId=" + options.scene
          })
        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          })
        }
        return
      }
    }
  }
  return pageObj
}

var checkPhone = function (pageObj) {
  if (pageObj.onLoad) {
    let _onLoad = pageObj.onLoad;
    // 使用onLoad的话需要传递options
    pageObj.onLoad = function (options) {
      if (wx.getStorageSync('user') && wx.getStorageSync('user').data.mobilePhone) {
        // 获取当前页面
        let currentInstance = getPageInstance();
        _onLoad.call(currentInstance, options);
      } else {
        //跳转到登录页
        wx.redirectTo({
          url: "/pages/bindPhone/bindPhone"
        })
        return
      }
    }
  }
  return pageObj;
}

// 获取当前页面    
function getPageInstance() {
  let pages = getCurrentPages();
  return pages[pages.length - 1]
}

module.exports = {
  getUser: getUser,
  getOpenId: getOpenId,
  getUserInfo: getUserInfo,
  getUserLocation: getUserLocation,
  checkUser: checkUser,
  checkPhone: checkPhone
}

