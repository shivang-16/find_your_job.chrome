const path = require("path");
const copyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    popup: path.resolve(__dirname, "src/popup/popup.tsx"),
    options: path.resolve(__dirname, "src/options/options.tsx"),
    background: path.resolve(__dirname, "src/background/background.ts"),
    contentScript: path.resolve(
      __dirname,
      "src/contentScript/contentScript.tsx"
    ),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
          "sass-loader"
        ],
        test: /\.(css|scss)$/i,
      },
      {
        type: "asset/resource",
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf)$/i,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new copyPlugin({
      patterns: [
        {
          from: "src/static",
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),

    ...getHTMLPlugins(["popup", "options"]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== "contentScript";
      },
    },
  },
};

function getHTMLPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlWebpackPlugin({
        title: "Find Your Job",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
