const { defineConfig } = require('@vue/cli-service')
const pkg = require('./package')

// 输出目录，格式：项目名@环境
const outputDir = `${pkg.name}@${process.env.NODE_ENV}`

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir,
  devServer: {
    proxy: { // 配置跨域
      '/api': {
        target: 'http://192.168.9.94:9611',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
})
