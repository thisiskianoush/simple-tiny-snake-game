const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/game.ts",
  devtool: "inline-source-map",
  output: {
    filename: "game-bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
};
