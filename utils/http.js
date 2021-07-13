let token;
// import md5 from "./md5.js"
import md5 from 'js-md5';
import Toast from '@vant/weapp/toast/toast';

var config = {
  host: "https://xingkong.uchar.cn",
  test: "http://120.79.28.173:8080",
  local: "http://192.168.0.153:8080",
  project: "/xingkong",
  appId: "xingkong",
  header: {
    AppId: "xingkong" 
  }
}
config.baseUrl = config.host + config.project;

let apis = {
  orderList: { url: "/api/orders-page"},
};
//调用:http.res["user"].get|post|put|delete|page




function getCode(url) {
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

function getParamsStr(paramsStr) {
  console.log(paramsStr+'==========')
  var newUrl = paramsStr.split("&").sort().join("&");
  var url = newUrl + "&appSecret=uchar.cn";
  console.log(url)
  console.log(md5(url).toString())
  return md5(url).toString();
  
}

function create(params) {
  // if (typeof params == "string") {
  //     return this.getParamsStr(params);
  // } else if (typeof params == "object") {
    console.dir(params)
  var arr = [];
  for (var i in params) {
    if (params[i] instanceof Array) {
      continue
    } else {
      arr.push((i + "=" + params[i]));
    }

  }
  return getParamsStr(arr.join(("&")));
  // }
}
var req = function (url, method, params, headers) {
  if (!headers) {
    headers = config.header
  }
  if (wx.getStorageSync("user").token) {
    headers.Authorization = wx.getStorageSync("user").token;
  }
  let sign = "";
  console.log(params)
  sign = create(params);
  let timestamp = new Date().getTime().toString()

  headers.timestamp = timestamp
  headers.Sign = sign

  wx.showNavigationBarLoading();

  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: config.baseUrl + url,
      method: method.toUpperCase(),
      data: params,
      header: headers,
      dataType: "json",
      success: function (resp) {
        wx.hideNavigationBarLoading();
        if (resp.statusCode == 200) {
          if (resp.data.errCode) {
            // wx.showToast({
            //   title: resp.data.errMsg || '',
            //   duration: 2000
            // })
            Toast.fail(resp.data.errMsg || '')
          }
          resolve(resp.data);
        } else {
          reject(resp);
        }
      },
      fail: reject
    })
  })
  return promise;
};


let res = {

};
for (var key in apis) {
  apis[key].get = function (url) {
    return function (params, headers) {
      return req(url, "GET", params, headers);
    };
  }(apis[key].url)

  apis[key].getById = (id) => {
    return function (url) {
      return req(url, "GET");
    }(apis[key].url + '/' + id)
  }

  apis[key].post = function (url) {
    return function (params, headers) {
      return req(url, "POST", params, headers);
    }
  }(apis[key].url)
  apis[key].put = function (url) {
    return function (params, headers) {
      return req(url, "PUT", params, headers);
    }
  }(apis[key].url)
  apis[key].delete = function (url) {
    return function (params, headers) {
      return req(url, "DELETE", params, headers);
    }
  }(apis[key].url)
  apis[key].page = function (url) {
    return function (params, headers) {
      return req(url + '-page', "GET", params, headers);
    }
  }(apis[key].url);

  if (apis[key].ext) {
    let ext = {};
    ext[key] = {};
    ext[key].url = apis[key].ext.url;
    ext[key].method = apis[key].ext.method;
    if (apis[key].ext.name && ext[key].url) {
      apis[key][apis[key].ext.name] = function (url, method) {
        return function (params, headers) {
          return req(url, method, params, headers);
        }
      }(ext[key].url, ext[key].method)
    }
  }
  res[key] = apis[key];
}
// for (var key in apis) {
//   let api = {};
//   api.url = apis[key].url;

//   api.get = function (params, headers) {
//     if (params && params.id) {
//       api.url += "/" + params.id;
//       delete params.id;
//     }
//     return req(api.url, "GET", params, headers);
//   }
//   api.post = function (params, headers) {
//     return req(api.url, "POST", params, headers);
//   }
//   api.put = function (params, headers) {
//     if (params && params.id) {
//       api.url += "/" + params.id;
//     }
//     return req(api.url, "PUT", params, headers);
//   }
//   api.delete = function (params, headers) {
//     return req(api.url, "DELETE", params, headers);
//   }
//   api.page = function (params, headers){
//     return req(api.url+'-page', "GET", params, headers);
//   }

//   if (apis[key].ext) {
//     let ext={};
//     ext.url = apis[key].ext.url;
//     ext.method = apis[key].ext.method;
//     if (apis[key].ext.name && ext.url) {
//       api[apis[key].ext.name] = function (params, headers) {
//         if (params && params.id) {
//           ext.url += "/" + params.id;
//           if ('GET'==ext.method.toUpperCase()){
//             delete params.id;
//           }
//         }
//         return req(ext.url, ext.method, params, headers);
//       }
//     }
//   }
//   res[key]=api;
// }

module.exports = {
  config: config,
  req: req,
  res: res,
  get: function (url, params, headers) {
    return req(url, "GET", params, headers);
  },
  post: function (url, params, headers) {
    return req(url, "POST", params, headers);
  },
  put: function (url, params, headers) {
    return req(url, "PUT", params, headers);
  },
  delete: function (url, params, headers) {
    return req(url, "DELETE", params, headers);
  }
}