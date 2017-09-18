const ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//const extractCSS = new ExtractTextPlugin('[name].css');
module.exports = {
    entry: {
        entry: './src/entry.js',
        song: "./src/song.js",
        playlist: "./src/playlist.js",
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: '[name].js'
    },
    externals: {
      'app': 'window.app={}',
    },
    plugins: [
        //extractCSS
        new ExtractTextPlugin('[name].css'),
        new HtmlWebpackPlugin({ 
            title: '网易云音乐',
            filename: './index.html', 
            template: './view/template.html', 
            hash: true, 
            minify: { 
                removeComments: true,
                collapseWhitespace: false 
            },
            chunks: ['entry']
        }),
        new HtmlWebpackPlugin({ 
            title: '播放列表',
            filename: './playlist.html', 
            template: './view/template-playlist.html', 
            hash: true, 
            minify: { 
                removeComments: true,
                collapseWhitespace: false 
            },
            chunks: ['playlist']
        }),
        new HtmlWebpackPlugin({ 
            title: '播放页面',
            filename: './song.html', 
            template: './view/template-song.html', 
            hash: true, 
            minify: { 
                removeComments: true,
                collapseWhitespace: false 
            },
            chunks: ['song']
        }),
    ],
    module: {
      loaders: [
          {
              test: require.resolve('./vendors/jquery.min'),
              use: [{
                  loader: 'expose-loader',
                  options: 'jQuery'
              },{
                  loader: 'expose-loader',
                  options: '$'
              }]
          },
          {
              test: /\.css$/,
              //loader: 'style-loader!css-loader!autoprefixer-loader'
              //use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
              loader: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: ['css-loader']
        })
          },
          {
              test: /\.(jpe?g|png|gif|svg)$/i,
              loaders: [
                  'file-loader?hash=sha512&digest=hex&name=./images/[hash].[ext]',
                  {
                      loader: 'image-webpack-loader',
                      options: {
                          gifsicle: {
                              interlaced: false,
                          },
                          optipng: {
                              optimizationLevel: 7,
                          },
                          pngquant: {
                              quality: '65-90',
                              speed: 4
                          },
                          mozjpeg: {
                              progressive: true,
                              quality: 65
                          },
                          // Specifying webp here will create a WEBP version of your JPG/PNG images
                          webp: {
                              quality: 75
                          }
                      }
                  }
                      //'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
              ]
          },
          //{
              //test: /\.(png|jpg|gif)$/,
              //use: [
                  //{
                      //loader: 'file-loader',
                      //options: {}  
                  //}
              //]
          //}
      ]
    }
}
