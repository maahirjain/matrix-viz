import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const entry = {
  main: "./src/pages/main/ts/index.ts"
};
export const output = {
  filename: "[name].[contenthash].js",
  path: path.resolve(__dirname, "dist"),
  assetModuleFilename: "[name][ext]",
  clean: true
};
export const devtool = "source-map";
export const module = {
  rules: [
    {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    },

    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },

    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: { loader: "ts-loader" }
    },

    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env"] }
      }
    },

    {
      test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|ttf|eot|ogg|mp3|wav|mov|mp4)$/i,
      type: "asset/resource"
    }
  ]
};
export const resolve = {
  extensions: [".ts", ".js"]
};
export const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/pages/main/index.html",
    filename: "index.html",
    chunks: ["main"]
  }),

  new BundleAnalyzerPlugin({
    openAnalyzer: false
  })
];
