/**
 * Created by lixia on 2017/11/10.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import fetch from '../axios'
Vue.use(Vuex)

const state = {
  notes: [],
  activeNote: {},
  user_id:'',
  user_name:'',
}

const actions = {
  getUserInfo ({ commit },userInfo) { //获取用户信息
    commit(types.GET_USER_INFO,userInfo)
  },
  async addNote ({dispatch, commit ,state}) { //创建一条便签
    const newNote = {
      text: '新便签',
      favorite: 0,
      id:state.user_id
    }
    await fetch._create(newNote)
    await dispatch('getAllNotes',state.user_id)
    commit(types.SET_ACTIVE_NOTE,state.notes[0]) //选中当前创建的便签
  },

  async deleteNote ({dispatch, commit,state },data) { //删除便签
    try {
      await fetch._delete(state.user_id,data.id)
      await dispatch('getAllNotes',state.user_id)
      commit(types.DELETE_NOTE,data)
    }catch (e){

    }
  },
  setActiveNote ({ commit }, note) { //设置当前便签的引用
    commit(types.SET_ACTIVE_NOTE, note)
  },

  async toggleFavorite ({dispatch, commit,state },data) { //收藏、取消收藏
    data.favorite = data.favorite=='0'?'1':'0'
    await fetch._update(state.user_id,data.id,data)
    await dispatch('getAllNotes',data.user_id)
  },

  async getAllNotes ({ commit,state }) { //获取列表
    let resData = await fetch._getAllNotes(state.user_id)
    commit(types.GET_ALL_NOTES,resData)
  },
  async setInitialNote ({ dispatch,commit,state}) { //登录初始化
    await dispatch('getAllNotes',state.user_id)
    commit(types.SET_ACTIVE_NOTE,state.notes[0])
  },
  updateText ({ commit,state },data) { //更新内容
    fetch._update(state.user_id,data.id,data)
  }
}

const mutations = {
  [types.GET_USER_INFO] (state,userInfo) {
    if(userInfo != null){
      state.user_id = userInfo.id;
      state.user_name = userInfo.name;
    }else{
      state.user_id = '';
      state.user_name = ''
    }
  },

  [types.DELETE_NOTE] (state,data) {
    if(data.id==state.activeNote.id){ //如果删除了当前选中项，选中列表第一个
      state.activeNote = state.notes[0] || {}
    }
  },

  [types.SET_ACTIVE_NOTE] (state, note) { //设置选中项
    state.activeNote = note || {}
  },

  [types.GET_ALL_NOTES] (state,resData) { //列表数据
    state.notes = resData
  },
}


export default new Vuex.Store({
  state,
  actions,
  mutations
})
