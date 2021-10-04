const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const port = 3000;

module.exports = (arg1, { WEBPACK_SERVE, mode }) => {
    console.log('arg1, WEBPACK_SERVE, mode', WEBPACK_SERVE, mode);
    const isEnvDevelopment = mode === 'development';
    const isEnvProduction = mode === 'production';
    const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');

    // webpack 설정 코드 작성. 작성된 코드는 module.export로 내보냄
    return {
        mode,
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js',
            publicPath: '/',
        },
        optimization: {
            minimize: true,
            minimizer: [
                // This is only used in production mode
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            // We want terser to parse ecma 8 code. However, we don't want it
                            // to apply any minification steps that turns valid ecma 5 code
                            // into invalid ecma 5 code. This is why the 'compress' and 'output'
                            // sections only apply transformations that are ecma 5 safe
                            // https://github.com/facebook/create-react-app/pull/4234
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/facebook/create-react-app/issues/5250
                            // Pending further investigation:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        // Added for profiling in devtools
                        keep_classnames: isEnvProductionProfile,
                        keep_fnames: isEnvProductionProfile,
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true,
                        },
                    },
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: [/node_modules/],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-react'],
                                plugins: ['@babel/plugin-proposal-class-properties'],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: {
                                    publicPath: (resourcePath, context) => {
                                        return path.relative(path.dirname(resourcePath), context) + '/';
                                    },
                                },
                            },
                        },
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                camelCase: true,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public/index.html'),
                filename: 'index.html',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
            new WebpackBundleAnalyzer({
                // analyzerMode: 'static',
                // reportFilename: 'webpack-bundle-size-analyze-report.md',
                // openAnalyzer: true,
            }),
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.webpack.js', '.web.js', '.mjs', '.ts', '.tsx', '.json'],
        },
        devServer: {
            host: 'localhost',
            port: port,
            open: true,
            historyApiFallback: true,
            hot: true,
        },
    };
};
