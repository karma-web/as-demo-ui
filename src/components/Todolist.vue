<template>
  <div id="todolist">
    <div id="toolbar">
      <i @click="addNote()"><Icon type="plus-round"></Icon></i>
      <i @click="logout()" class="logout"><Icon type="android-exit"></Icon></i>
    </div>
    <div id="notes-list">
      <div id="list-header">
        <h2>Notes | {{user_name}}</h2>
        <div class="btn-group btn-group-justified" role="group">
          <!-- All Notes button -->
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default"
                    @click="show = 'all'"
                    :class="{active: show === 'all'}">
              All Notes
            </button>
          </div>
          <!-- Favorites Button -->
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default"
                    @click="show = 'favorites'"
                    :class="{active: show === 'favorites'}">
              Favorites
            </button>
          </div>
        </div>
      </div>
      <!-- render notes in a list -->
      <div class="container">
        <div class="list-group">
          <div class="list-group-item-body" v-for="(note,index) in filteredNotes">
            <a class="list-group-item" href="#"
               :class="{active: activeNote.id === note.id}"
               @click="setActiveNote(note)">
              <h4 class="list-group-item-heading">
                {{note.text.replace(/<.*?>/ig,"").trim().substring(0, 25)}}
              </h4>
            </a>
            <span class="action-icon">
                <i @click="toggleFavorite({id:note.id,favorite:note.favorite})" >
                  <Icon v-if="note.favorite" type="android-favorite"></Icon>
                  <Icon v-else type="android-favorite-outline"></Icon>
                </i>
                <i @click="deleteNote({id:note.id})"><Icon type="ios-trash"></Icon></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div id="note-editor">
      <quill-editor v-model="activeNote.text"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @focus="onEditorFocus(activeNote)"
                    @blur="onEditorBlur($event)">
      </quill-editor>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {verifyToken} from '../Utils/Tools'
  import {quillEditor} from 'vue-quill-editor'
  import clone from 'v-deep-clone'
  export default {
    components: {
      quillEditor
    },
    created(){
      const userInfo = verifyToken();// 验证并获取该用户信息
      this.getUserInfo(userInfo)
    },
    data () {
      return {
        timer:'',
        show: 'all',
        editorOption: {
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline','strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'color': [] }, { 'background': [] }],
              ['image', 'link','code-block']
            ]
          },
        }
      }
    },
    computed: {
      ...mapState([
        'notes',
        'activeNote',
        'user_id',
        'user_name'
      ]),
      filteredNotes () {
        if (this.show === 'all'){
          return this.notes
        } else if (this.show === 'favorites') {
          return this.notes.filter(note => note.favorite)
        }
      }
    },
    mounted(){
      this.setInitialNote()
    },
    watch: {
      activeNote (val, old) {
        window.clearInterval(this.timer)
        this.updateText(old)
      }
    },
    methods: {
      ...mapActions([
          'getUserInfo',
          'addNote',
          'deleteNote',
          'toggleFavorite',
          'setActiveNote',
          'getAllNotes',
          'setInitialNote',
          'updateText'
      ]),
      logout(){
        sessionStorage.setItem('demo-token',null); // 将token清空
        this.$router.push('./')
      },
      onEditorBlur(){
        window.clearInterval(this.timer)
        this.updateText(this.activeNote)
      },
      onEditorFocus(data){
        let _this = this
        let currentNote = clone(data)
         this.timer = window.setInterval(function(){
          if(data.text !== currentNote.text){
            currentNote = clone(data)
            _this.updateText(data)
          }
        },5000);
      }
    },
  }
</script>
