// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: "prod-5gzqpk7480d92afc",
});
const db = cloud.database();
// 云函数入口函数
const WEEKTIME = 1000 * 60 * 60 * 24 * 7; //7天内
exports.main = async (event, context) => {
  var res;

  switch (event.httpType) {
    case "get":
      const hDb = db.collection("household");
      if (event._id) {
        // 获取详情
        res = await hDb.doc(event._id).get();
        const now = new Date();
        // 是否在7天内更改过信息（抄写过水电）

        res.data.isFlag = now - WEEKTIME < res.data.updateTime;

        return res.data;
      } else {
        // 获取列表
        res = await hDb.orderBy("name", "asc").get();
        const now = new Date();
        // 是否在7天内更改过信息（抄写过水电）
        res.data.forEach((item) => {
          item.isFlag = now - WEEKTIME < item.updateTime;
        });
        return res.data;
      }

    case "add":
      // 更新房源信息
      delete event.httpType;
      event.householdList.forEach(item=>{
        db
        .collection("household")
        .add({
          data: {
            ...item,
            updateTime: new Date(),
          },
        });
      })
      // res = await db
      //   .collection("household")
      //   .add({
      //     data: {
      //       ...event,
      //       updateTime: new Date(),
      //     },
      //   });
      return true;

    case "update":
      delete event.httpType;
      res = await db
        .collection("household")
        .doc(event.id)
        .update({
          data: {
            electric: data.electric,
            water: event.water,
            updateTime: new Date(),
          },
        });
      return res.data;

    default:
      break;
  }
};
