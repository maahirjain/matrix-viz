import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import common from "./webpack.config";
import { merge } from "webpack-merge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge(common, {
  mode: "production",

  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "[name][ext]"
  }
});
