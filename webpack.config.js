const config = {
    entry: {
      ridcully: './build/Main.js'
    },
    output: {
      libraryTarget: 'window',
      filename: 'main.js',
      path: __dirname + '/dist'
    },
    mode: 'development'
}

module.exports = config;
