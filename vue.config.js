const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: { // 配置跨域
      '/api': {
        target: 'http://192.168.9.250:9612',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
})
