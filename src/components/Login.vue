<template>
  <div class="i-login">
      <img style="width: 250px" src="../assets/image/bmonkey.png" alt="">
    <Form ref="formInline" :model="formInline" :rules="ruleInline">
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="Username">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" @keyup.native.enter="submit('formInline')" v-model="formInline.password" placeholder="Password">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button long type="primary" @click.native="submit('formInline')">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import fetch from '../axios'
  export default {
    data () {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' },
            { type: 'string', min: 3, message: '密码长度不能小于3位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.login()
          }else {
              this.$Message.error('表单验证失败!');
          }
        })
      },
      login (){
        let obj = {
          name: this.formInline.user,
          password: this.formInline.password
        }
        fetch._login(obj).then((res) => { // 将信息发送给后端，返回数据都在res.data里
          if(res.success){ // 如果成功
          sessionStorage.setItem('demo-token',res.token); // 用sessionStorage把token存下来
          this.$Message.success('登录成功！' ); // 登录成功，显示提示语
          this.$router.push('/todolist') // 进入todolist页面，登录成功
        }else{
          this.$Message.error(res.info); // 登录失败，显示提示语
          sessionStorage.setItem('demo-token',null); // 将token清空
        }
      }, (err) => {
          this.$Message.error('请求错误！')
          sessionStorage.setItem('demo-token',null); // 将token清空
        })
      }
  }
}
</script>
<style>
  .i-login {
    width: 300px;
    margin: 100px auto;
  }
</style>
