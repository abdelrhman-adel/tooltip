const merge = require("webpack-merge");
const common = require("./webpack.config.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].bundle.[hash].css"
    })
  ],
  mode: "production"
});
