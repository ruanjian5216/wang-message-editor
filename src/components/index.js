import wangMessageEditor from './wangMessageEditor.vue'
wangMessageEditor.install = (Vue) => { 
  Vue.component('wang-message-editor', wangMessageEditor)
}

export default wangMessageEditor