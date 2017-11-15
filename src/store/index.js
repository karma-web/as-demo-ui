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
  getUserInfo ({ commit },userInfo) {
    commit(types.GET_USER_INFO,userInfo)
  },
  async addNote ({dispatch, commit ,state}) {
    const newNote = {
      text: '新便签',
      favorite: 0,
      id:state.user_id
    }
    let data = await fetch._create(newNote)
    await dispatch('getAllNotes',state.user_id)
    commit(types.ADD_NOTE,data)
  },

  async deleteNote ({dispatch, commit,state },data) {
    try {
      await fetch._delete(state.user_id,data.id)
      await dispatch('getAllNotes',state.user_id)
      commit(types.DELETE_NOTE,data)
    }catch (e){

    }
  },

  setActiveNote ({ commit }, note) {
    commit(types.SET_ACTIVE_NOTE, note)
  },

  async toggleFavorite ({dispatch, commit,state },data) {
    await fetch._update(state.user_id,data.id,data)
    await dispatch('getAllNotes',data.user_id)
  },

  async getAllNotes ({ commit,state }) {
    let resData = await fetch._getAllNotes(state.user_id)
    commit(types.GET_ALL_NOTES,resData)
  },
  async setInitialNote ({ dispatch,commit,state}) {
    await dispatch('getAllNotes',state.user_id)
    commit(types.SET_INITIAL_NOTE)
  },
  async updateText ({ commit,state },data) {
    await fetch._update(state.user_id,data.id,data)
    commit(types.UPDATE_TEXT)
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
  [types.ADD_NOTE] (state,newNote) {
    state.activeNote = newNote
  },

  [types.DELETE_NOTE] (state,data) {
    if(data.id==state.activeNote.id){
      state.activeNote = state.notes[0]
    }
  },

  [types.TOGGLE_FAVORITE] (state) {

  },

  [types.SET_ACTIVE_NOTE] (state, note) {
    state.activeNote = note
  },

  [types.GET_ALL_NOTES] (state,resData) {
    state.notes = resData
  },
  [types.SET_INITIAL_NOTE] (state) {
    state.activeNote = state.notes[0] || {}
  },
  [types.UPDATE_TEXT] (state) {

  },
}


export default new Vuex.Store({
  state,
  actions,
  mutations
})
