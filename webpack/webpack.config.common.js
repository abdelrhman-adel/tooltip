const path = require("path");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin/dist/clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    library: "./lib/index.ts",
    demo: "./demo/main.ts"
  },
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "[name].bundle.[hash].js"
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader" }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "demo/index.html",
      template: "demo/index.html"
    })
  ],
  resolve: {
    extensions: ['.js','.ts','.tsx','.sass','.scss']
  }
};
