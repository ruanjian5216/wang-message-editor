const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    // 是否提炼css到单独的文件
    extract: false,
    // 是否生成源文件
    sourceMap: false,
},
})
