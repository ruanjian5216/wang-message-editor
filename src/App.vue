<template>
  <div id="app">
    <wangMessageEditor @input="input" :limitInputLength="10" />
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
  },
};
</script>


