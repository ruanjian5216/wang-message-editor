<template>
  <div id="app">
    <wang-message-editor @input="input" :limitInputLength="10" ref="editRef" />

    <button @click="btnClick">btn</button>
  </div>
</template>

<script>
import wangMessageEditor from "./components/index";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    wangMessageEditor,
  },
  methods: {
    input(e) {
      console.log(e);
    },
    btnClick() {
      // this.$refs.editRef.clear()
      // this.$refs.editRef.blur()
      let a = document.querySelector(".input_panel");
      console.dir(a);
    },
  },
};
</script>


