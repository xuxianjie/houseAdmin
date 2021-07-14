// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'prod-5gzqpk7480d92afc'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  const result
  
  switch (event.httpType) {
    case 'get':
      const result = await db.collection('household').orderBy('name', 'asc').get().data
      break;
    case 'post':
      let promiseAll = []
      if(event.householdList){
        // event.householdList.forEach(item=>{
        //   promiseAll.push(new Promise((resolve,reject)=>{
        //     db.collection('household').doc(item.id).update({
        //       data:
        //     })
        //   }))
        // })
      }else{
        return false
      }
      break;
    default:
      break;
  }
  return result
}