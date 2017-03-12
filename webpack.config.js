var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'ReduxSagaUtils',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            }
        ]
    },

    // All from the peer/prod dependencies should be there.
    externals : {
        'redux-saga/effects': {
            commonjs: "redux-saga/effects",
            commonjs2: "redux-saga/effects",
            amd: "redux-saga/effects",
            root: "ReduxSaga.effects",
        },
    }
};
