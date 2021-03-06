### 

egg-rpc
=====

实现在 egg 中使用 rpc, 遵循 [JSON-RPC 2.0 Specification](http://www.jsonrpc.org/specification)

## 安装插件
``` js
npm install --save egg-rpc
```

## 开启插件
```js
// app/config/plugin.js

exports.eggRpc = {
  enable: true,
  package: 'egg-rpc',
};
``` 

#### 配置

``` js 
// app/config/config.default.js

config.eggRpc = {
  /* egg rpc 地址
   * 可省略，默认为 rpc.endpoint，请注意网址前不要少了 /
   */ 
  endpoint:'/rpc.endpoint', 
  // 是否启用版本控制 
  enableVersion: false,
  // 当启用了版本控制时，此属性用于配置每个版本对应的路径
  versionDirMapping: {
    /*
     * key: url 地址，如访问此版本的地址为: http://localhost/rpc.endpoint/v1
     * value: 文件夹的地址，必须放在 rpc 目录下
    */
    v1:'v1'
  }
}
```   

开启插件后，RPC 会暴露一个 http 地址，格式为：http://egg程序地址/指定的rpc地址 ,如 http://localhost:7001/rpc.endpoint，如果启用了版本号，则为：http://localhost:7001/rpc.endpoint/版本号

## 编写 rpc
所有的 rpc 文件都必须放到 app/rpc 目录下，可以支持多级目录，访问的时候可以通过目录名级联访问，如有一个文件，其存放在 app/rpc/operation/user.js 目录下，可通过 operation.user.method 进行访问。每个文件代表一个 rpc 的类。
 
### rpc 类
一个类下可以暴露多个 rpc 方法，例如：

``` js
const RPC = require('egg-rpc').RPC;

class Operation extends RPC { 
  * sum({a,b}){
    if(!_.isNumber(a) || !_.isNumber(b)){
      this.fail(-327001,'输入参数 a,b 必须为数字.');
      return;
    } 
    // 调用 egg 服务
    let randomNum = this.service.Operation.getRadomNum();
    let result = a + b + randomNum; 
    // 输出正确结果
    this.success(result);
  } 

  * substract({a,b}){
    let result = a - b;
    return result;
  }
}

module.exports = Operation;
```

### rpc 方法
``` javascript
每个方法都由三部份组成，方法名、输入、输出。
1.方法名：根据你的业务规则定义方法名。
2.输入：通过 es6 的[解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)传值。

3.输出：调用继承的 RPC 类提供的三个方法：
*.this.success(result)：成功返回到客户端 。
*.this.fail(code, message, data): 返回失败到客户端，code 为错误码，message 为返回错误的信息, data 用于告诉客户端具体的错误信息。
*.this.throw(err, code, message): 返回异常到客户端，error 为 javascript Error 对象，code 为错误码，message 为返回错误的信息。

```

#### 在方法体内调用 service
直接通过 this.service 访问，例如：this.service.User.add()

## 客户端调用
通过 axios 或 request 库进行请求，地址为: http://你的 egg 程序地址/rpc.endpoint。发送如下的请求体:
{"jsonrpc": "2.0", "method": "Operation.sum", "params": {"a": 23, "b": 42}, "id": 3}

例如：
``` js
axios.post('http://localhost:7001/rpc.endpoint', {
  "jsonrpc": "2.0",
  "method": "Operation.sum",
  "params": {
    "a": 23,
    "b": 42
  },
  "id": 3
})
  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.log(error);
  });
```



## Contributors(1)

Ordered by date of first contribution.

- [![](https://avatars0.githubusercontent.com/u/3305041?s=40&v=4)@国勇](http://ygyblog.com) 
 