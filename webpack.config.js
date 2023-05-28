/** @format */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('terser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const fs = require('fs')
const isDebug = process.env.NODE_ENV === 'development'
const root_path = __dirname
console.log('isDebug', isDebug)
class WebpackVerPlugin {
    // 构造函数
    constructor(options) {
        console.log('WebpackVerPlugin ', options)
        this.options = options
    }
    // 应用函数
    apply(compiler) {
        // console.log(compiler)
        compiler.hooks.afterEmit.tapAsync('WebpackVerPlugin', async (compilation, callback) => {
            const outputPath = compilation.outputOptions.path
            const {src, dst} = this.options
            const json = require(src)
            const {ver} = json
            if (!ver) {
                console.error('ver missing')
            }
            console.log(path.join(outputPath, dst), ver, {ver})
            fs.writeFile(path.join(outputPath, dst), JSON.stringify({ver}), err => {
                if (!err) console.log('write ver success !')
            })
            callback()
        })
    }
}

module.exports = {
    mode: isDebug ? 'development' : 'production',
    context: root_path,
    entry: {
        app: path.join(__dirname, 'src/App.tsx'),
    },

    output: {
        clean: true,
        path: path.join(__dirname, 'html/dist'),
        filename: '[name].bundle.js',
    },
    devtool: isDebug ? 'source-map' : false,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: ['src', 'node_modules'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.join(__dirname, 'tsconfig.json'),
            }),
        ],
    },
    cache: {
        type: 'memory',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.tsx?$/,

                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(less)$/,
                use: isDebug
                    ? [
                          'style-loader',
                          'css-loader',

                          {
                              loader: 'less-loader',
                              options: {
                                  lessOptions: {
                                      javascriptEnabled: true,
                                      // strictMath: true,
                                  },
                                  javascriptEnabled: true,
                              },
                          },
                      ]
                    : [
                          {
                              loader: MiniCssExtractPlugin.loader,
                          },
                          {
                              loader: 'css-loader',
                              options: {
                                  sourceMap: true,
                              },
                          },
                          {
                              loader: 'less-loader',
                              options: {
                                  lessOptions: {
                                      strictMath: true,
                                  },
                              },
                          },

                          // "less-loader?javascriptEnabled=true"
                      ],
            },
            {
                test: /\.css$/,
                use: [
                    isDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                // 引用的资源如果是 '${svg-path}/icon-comment.svg?abc'
                test: /\.svg$/,
                resourceQuery: /dist/,
                // 以webpack的资源形式加载（普通资源文件、base64等）
                type: 'asset',
            },
            {
                // 除了上面的匹配规则，我们都按照React组件来使用
                test: /\.svg$/,
                resourceQuery: {not: [/dist/]},
                use: ['@svgr/webpack'],
            },
        ],
    },

    optimization: {
        minimize: true,
        usedExports: true,
        sideEffects: true,
        removeEmptyChunks: true,
        minimizer: [
            new UglifyJsPlugin({
                extractComments: false,
                parallel: true,

                terserOptions: {
                    ie8: false,
                    safari10: false,
                    compress: !isDebug,
                    warnings: isDebug,
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
        runtimeChunk: {
            name: 'manifest',
        },
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'all',
                    priority: -10,
                    minChunks: 3,
                    reuseExistingChunk: false,
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true,
                },
                commons: {
                    // async 设置提取异步代码中的公用代码
                    chunks: 'async',
                    name: 'commons',
                    /**
                     * minSize 默认为 30000
                     * 想要使代码拆分真的按照我们的设置来
                     * 需要减小 minSize
                     */
                    minSize: 0,
                    priority: -20,
                    // 至少为两个 chunks 的公用代码
                    minChunks: 2,
                    reuseExistingChunk: true,
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    performance: {
        hints: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDebug ? JSON.stringify('development') : JSON.stringify('production'),
            },
        }),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: isDebug ? '[name].css' : '[name].[chunkhash:8].css',
            chunkFilename: isDebug ? '[id].css' : '[id].[chunkhash:8].css',
        }),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'html/index.html'),
            template: path.join(__dirname, 'src/templates/normal.tpl'),

            inject: 'body',
            hash: true,
            cache: true,

            chunks: ['vendor', 'app', 'manifest', 'commons'],
        }),

        new WebpackVerPlugin({
            src: './version.json',
            dst: 'ver.json',
        }),
    ],
}
