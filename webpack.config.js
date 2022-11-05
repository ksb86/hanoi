const path = require('path');

module.exports = {
    mode: 'development',
    ignoreWarnings: [
        {
            module: /index.scss/, // A RegExp
        },
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    // output: path.resolve(__dirname, 'dist'),
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                            ],
                        },
                    },
                ],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'main.css',
                },
                use: ['sass-loader'],
            },
        ],
    },
};
