const path = require("path");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin/dist/clean-webpack-plugin");

module.exports = {
  entry: {
    library: "./lib/index.ts",
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

  ],
  resolve: {
    extensions: ['.js','.ts','.tsx','.sass','.scss']
  }
};
