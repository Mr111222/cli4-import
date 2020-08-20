const path = require("path")
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production'
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.PUBLICPATH,
  devServer: {
    port: 8888, 
    open: true,
  },
  // webpack配置
  chainWebpack: config => {
    // config
    //   .entry('index')
    //   .add('babel-polyfill')
    //   .end()
    // 配置别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@img", resolve("src/assets/image"))
      // 开启打包分析
      // if (isProduction) {
      //   config
      //   .plugin('webpack-bundle-analyzer')
      //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
      // }
    // 生产环境配置
    if (isProduction) {
      // 图片压缩
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({ bypassOnDebug: true })
      // 删除预加载
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          commons: {
            chunks: "initial",
            minChunks: 2,
            name: "commons",
            maxInitialRequests: 5,
            minSize: 0,
          },
          commonUi: {
            test: (module) => {
              return /element-ui|ant-design-vue|jquery/.test(module.context);
            },
            chunks: "initial",
            name: "commonUi",
            priority: 10,
          },
          commonUtil: {
            test: (module) => {
              return /axios|echarts|moment/.test(module.context);
            },
            chunks: "initial",
            name: "commonUtil",
            priority: 10,
          },

        }
      })
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // 为生产环境修改配置
      config.plugins.push(
        // 生产环境自动删除console
        new TerserPlugin({
          cache: true,
          parallel: 4,
          sourceMap: false,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      ),
      config.plugins.push(
        // 开启压缩
         new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: /\.(js|css)$/, // 匹配文件名
            threshold: 10000, // 对超过10k的数据压缩
            deleteOriginalAssets: false, // 不删除源文件
            minRatio: 0.8 // 压缩比
        })
      )
    } else {
      // 为开发环境修改配置...
    }
  },
}
