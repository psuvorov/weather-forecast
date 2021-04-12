const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[fullhash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: ["./scripts/main.ts"],
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'assets/[name][ext]'
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    target: "web",
    devtool: isDev ? "source-map" : false,
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        port: 3000,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: "index.html",
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
                // {from: path.resolve(__dirname, "src/favicon.png"), to: path.resolve(__dirname, "dist")},
                {from: path.resolve(__dirname, "assets/images/leaflet/"), to: path.resolve(__dirname, "dist/assets/css/images/")},
                // {from: path.resolve(__dirname, "assets/fonts/"), to: path.resolve(__dirname, "dist/assets/fonts/")},

                {from: path.resolve(__dirname, "assets/scripts/"), to: path.resolve(__dirname, "dist/assets/scripts/")},
                {from: path.resolve(__dirname, "assets/css/"), to: path.resolve(__dirname, "dist/assets/css/")}
            ],
            options: {
                concurrency: 100,
            },
        }),
        new MiniCssExtractPlugin({
            filename: filename("css")
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|woff|woff2|svg)$/i,
                type: 'asset/resource'
            }
        ]
    }
};
