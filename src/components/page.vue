<template>
  <div class="list-body">
    <span class="list-logout" title="登出" @click="logout()"><Icon type="android-exit"></Icon></span>
    <p class="list-title">欢迎&nbsp;{{usename}}&nbsp;,这是你的事项清单：</p>
    <Input size="large" placeholder="请输入..." style="width: 400px" v-model="todos" @keyup.enter.native="add()"></Input>
    <div class="list-tab">
      <Tabs value="name1">
        <TabPane label="待办事项" name="name1">
          <template v-if="todo">
            <ul class="list-group" v-for="(item,index) in list">
              <li class="list-group-item" v-if="!item.status">
                <Button size="small" type="warning" shape="circle" icon="close-round" @click="remove(index)"></Button>
                <Button size="small" type="primary" shape="circle" icon="checkmark-round" @click="update(index)"></Button>
                {{item.content}}</li>
            </ul>
          </template>
          <p v-else>暂无待办事项</p>
        </TabPane>
        <TabPane label="已完成事项" name="name2">
          <template v-if="count>0">
            <ul class="list-group"  v-for="(item,index) in list">
              <li class="list-group-item" v-if="item.status">
                <Button size="small" type="success" shape="circle" icon="reply" @click="update(index)"></Button>{{item.content}}</li>
            </ul>
          </template>
          <p v-else>暂无完成事项</p>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
  import {verifyToken} from '../Utils/Tools'
  export default {
    created(){
      const userInfo = verifyToken(); // 新增一个获取用户信息的方法
      if(userInfo != null){
        this.user_id = userInfo.id;
        this.usename = userInfo.name;
      }else{
        this.user_id = '';
        this.name = ''
      }
    },
    data () {
      return {
        user_id:'',
        usename:'k',
        todos:'',
        count:0,
        list:[]
      }
    },
    mounted(){
      this.getTodolist ()
    },
    computed: {
      todo(){
        let count=0
        let length=this.list.length
        this.list.map(function (item,index) {
          item.status?count+=1:''
        })
        this.count=count
        if(count==length || length==0){
          return false
        }else{
          return true
        }
      }
    },
    methods: {
      add(){
        if(this.todos=='')
          return
        let obj={
          content:this.todos,
          status:false,
          id: this.user_id
        }
        this.$http.post('/api/todolist', obj).then((res) => {
          if (res.status === 200) {
          this.$Message.success('创建成功！')
          this.getTodolist ()
        } else {
          this.$Message.error('创建失败！')
        }
      }, (err) => {
          this.$Message.error('创建失败！')
        })
        this.todos = ''
      },
      remove(index){
        this.$http.delete('/api/todolist/' + this.user_id+'/'+this.list[index].id).then((res) => { //获取该用户的todolist列表
          if (res.status === 200) {
          this.$Message.success('删除成功')
          this.getTodolist()
        } else {
          this.$Message.error('删除失败')
        }
      }, (err) => {
          this.$Message.error('删除失败！')
        })
      },
      update(index){
        this.$http.put('/api/todolist/' + this.user_id+'/'+this.list[index].id+'/'+this.list[index].status).then((res) => { //获取该用户的todolist列表
          if (res.status === 200) {
          this.$Message.success('状态更新成功！')
          this.getTodolist()
        } else {
          this.$Message.error('状态更新失败')
        }
      }, (err) => {
          this.$Message.error('状态更新失败！')
        })
      },

      logout(){
        sessionStorage.setItem('demo-token',null); // 将token清空
        this.$router.push('./')
      },
      getTodolist () {
        this.$http.get('/api/todolist/' + this.user_id).then((res) => { //获取该用户的todolist列表
          if (res.status === 200) {
          this.list = res.data
        } else {
          this.$Message.error('获取列表失败！')
        }
      }, (err) => {
          this.$Message.error('获取列表失败！')
        })
      }
    }
  }
</script>
<style>
  .list-body {
    margin-top: 200px;
    min-width: 400px;
  }
  .list-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-family: "Microsoft YaHei";
  }
  .list-tab {
    width: 400px;
    margin: 20px auto;
  }
  .list-tab ul {
    margin-bottom: 5px;
  }
  .list-tab ul li {
    background-color: #d3eae2;
    text-align: left;
  }
  .list-tab ul li button {
    float: right;
    margin-left: 5px;
  }
  .list-logout {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    font-size: 20px;
  }
</style>
