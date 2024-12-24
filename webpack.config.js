const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // TODO: The entry point file described above
  entry: {
    home: { import: "./public/js/index", filename: "js/[name].bundle.js" },
    signin: { import: "./public/js/signin", filename: "js/[name].bundle.js" },
    signup: { import: "./public/js/signup", filename: "js/[name].bundle.js" },
    mainpage: { import: "./public/js/mainpage", filename: "js/[name].bundle.js" },
    Success: { import: "./public/js/Success", filename: "js/[name].bundle.js" },
    Failed: { import: "./public/js/Failed", filename: "js/[name].bundle.js" },
    loading: { import: "./public/js/loading", filename: "js/[name].bundle.js" },
  },
  // TODO: The location of the build folder described above
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/bundle.js",
  },
  plugins: [
    new Dotenv({
      path: "./.env", // Path to .env file (this is the default)
      safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/py", to: "py" }, // 將 public/py 目錄中的所有文件複製到輸出目錄的 py 目錄中
      ],
    }),
  ],
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: "eval-source-map",
};
