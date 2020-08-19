module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "targets": {
          "node": "current"
        }
      },
    ]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 全局加载需ant需要注释下面的配置，才能在main.js中进行引用并且use
    "@babel/plugin-syntax-dynamic-import",
    [
      "import",
      {
        "libraryName": "ant-design-vue",
        "libraryDirectory": "es",
        "style": "css"
      }
    ]
  ]
}