
import axios from 'axios'

export function fetch (url, method, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: method || 'get',
      url: url,
      data: params || {},
      // responseType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformRequest: [function (data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    })
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        // console.log(error.response)
        reject(error)
      })
  })
}

const _getAllNotes = function (user_id) { //获取列表所有数据
  return fetch('/api/todolist/'+user_id)
}
const _login = function (data) { //登录
  return fetch('/auth/user','post',data)
}
const _create = function (data) { //创建便签
  return fetch('/api/todolist','post',data)
}
const _delete = function (user_id,id) { //删除便签
  return fetch('/api/todolist/'+user_id+'/'+id,'delete')
}
const _update = function (user_id,id,data) { //更新便签
  return fetch('/api/todolist/'+user_id+'/'+id,'put',data)
}
export default {
  _getAllNotes,
  _login,
  _delete,
  _create,
  _update
}
