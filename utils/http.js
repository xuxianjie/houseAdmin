const apiArray = ['household']

const http = {
  get: async function (api, data) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'get'}}).get()
    return res
  },
  add: async function (data) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'add'}}).get()
    return res
  },
  remove: async function (data) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'remove'}}).get()
    return res
  },
  update: async function (data) {
    const res = await wx.cloud.callFunction({ name: api,data:{...data,httpType:'update'}}).get()
    return res
  },
}

module.exports = http