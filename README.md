### install

```
wang-message-editor
```

### use

main.js

```js
import Vue from 'vue'
import wangMessageEditor from "wang-message-editor";
Vue.use(wangMessageEditor)
```



```vue
<template>
  <div id="app">
    <wangMessageEditor @input="input" :limitInputLength="0" />
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
```



### methods

`input` 输入框改变事件

### props

`limitInputLength` 输入框字数限制， 

| 参数             | 参数类型 | 功能           |
| ---------------- | -------- | -------------- |
| limitInputLength | Number   | 输入框字数限制 |
|                  |          |                |

### 效果展示

![image-20220517170110107](images/image-20220517170110107.png)