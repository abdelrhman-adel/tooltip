const merge = require("webpack-merge");
const path = require("path");
const common = require("./webpack.config.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = merge(common, {
  entry: {
    library: "./lib/index.ts",
    demo: "./demo/main.ts"
  },
  devServer: {
    contentBase: path.join(__dirname, "../public/"),
    index: "demo/index.html"
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "demo/index.html",
      template: "demo/index.html"
    })
  ],
  mode: "development"
});
