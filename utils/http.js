const apiArray = ['household']

const http = {
  get: async function (api, data={}) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'get'}})
    return res
  },
  add: async function (api,data={}) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'add'}})
    return res
  },
  remove: async function (api,data={}) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'remove'}})
    return res
  },
  update: async function (api,data={}) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'update'}})
    return res
  },
  getMsg:function(errMsg){
    return errMsg === 'cloud.callFunction:ok'
  }
}

module.exports = http