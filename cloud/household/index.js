// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'prod-5gzqpk7480d92afc'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const res = await db.collection('household').orderBy('name','asc').get()
  return res.data
}