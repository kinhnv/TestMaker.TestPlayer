const path = require('path');

module.exports = {
    entry: {
        'js/home': './src/ts/home/index.ts',
        'js/events': './src/ts/events/index.ts',
        'js/testplayer': './src/ts/testplayer/index.ts',
        'js/login': './src/ts/login/index.ts',
        'sw': './src/sw.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'wwwroot/'),
    },
};