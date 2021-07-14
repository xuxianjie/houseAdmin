// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: "prod-5gzqpk7480d92afc",
});
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var res;

  switch (event.httpType) {
    case "get":
      res = await db.collection("household").orderBy("name", "asc").get();
      break;
    case "add":
      let promiseAll = [];
      if (event.householdList) {
        event.householdList.forEach((item) => {
          // 更新房源信息
          // 确保有上传当前水电
          if (item.currentElectric && item.currentWater) {
            promiseAll.push(
              new Promise((resolve, reject) => {
                db.collection("household")
                  .doc(item._id)
                  .update({
                    data: {
                      electric: item.currentElectric,
                      water: item.currentWater,
                      lastElectric:item.electric,
                      lastWater:item.water,
                      updateTime: new Date(),
                    },
                  })
                  .then((res) => {
                    resolve(res);
                  });
              })
            );
            promiseAll.push(
              new Promise((resolve, reject) => {
                db.collection("record")
                  .add({
                    data: {
                      createTime: new Date(),
                      electric: item.currentElectric,
                      water: item.currentWater,
                      householdId: item.house,
                      householdName: item.name,
                    },
                  })
                  .then((res) => {
                    resolve(res);
                  });
              })
            );
          }
        });
        res = await Promise.all(promiseAll).then();
        console.log(res);
      } else {
        return false;
      }
      break;
    default:
      break;
  }
  return res.data;
};
