/**
 * Created by lixia on 2017/11/8.
 */
import jwt from 'jsonwebtoken'

export const verifyToken = function () { //解析token 验证secret 并返回用户信息
  let token = sessionStorage.getItem('demo-token');
  if(token != null && token != 'null'){
    let decode = jwt.verify(token,'karma-vue2-koa2-iview2'); // 解析token
    return decode // decode解析出来实际上就是{name: XXX,id: XXX}
  }else {
    return null
  }
}
