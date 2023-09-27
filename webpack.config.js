const config  = {
    mode: 'production',

    entry: {
        // сюда надо занести каждый файл, который надо перенести в сборку
        index: './src/js/index.js',
    },

    output: {                
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
}

module.exports = config;