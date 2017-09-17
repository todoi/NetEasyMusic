//音乐列表载入函数
!function($, AV, app){
    function loadSonglist(objectID,writeOrder,listSelector,loadingSelector){
        let args = {
            playlist: getPlaylist(objectID),
            htmlTemplate: window.app.createHtmlPattern(writeOrder),
            selector: listSelector,
            callback: writeSong,
            writeOrder: writeOrder
        }
        getSongInfo(args).then(
            function(){$(loadingSelector).removeClass('loading')},
            function(){$(loadingSelector).removeClass('loading')}
        )
    }

    window.app.loadSonglist = loadSonglist

    function getPlaylist (objectId){
        let playlist = new AV.Query('Playlist')
        return playlist.get(objectId).then(function (song) {
            return window.JSON.parse(song.attributes.content)
        }, function (error) {
            console.log(error)
        })
    }

    function getSongInfo (args){
        let {playlist, selector, htmlTemplate, callback, writeOrder} = args
        let songArray = []
        let countIndex = []
        let promiseAll = []
        return playlist.then(fullfilled,rejected)

        function fullfilled(list){
            let listLength = list.length
            list.forEach(function (songId, index) {
                let song = new AV.Query('Song');
                let promise = song.startsWith('songId', songId + '').find().then(
                    function(array){success(array,index)},
                    function(error){fail(error,index)}
                )
                promiseAll.push(promise)
            })
            return Promise.all(promiseAll)

            function success(array, index){
                //array 有可能返回空数组
                if (array.length) {
                    let {attributes : songInfo, id} = array[0]
                    songInfo.id = id
                    songArray[index] = songInfo
                }
                countIndex.push(1)
                countIndex.length === listLength && callback(songArray, selector, htmlTemplate, writeOrder)
            }

            function fail(error,index){
                console.log(error);
                songArray[index] = null;
                countIndex.push(1)
                countIndex.length === listLength && callback(songArray, selector, htmlTemplate, writeOrder)
            }
        }

        function rejected(error){
            console.log(error)
        }
    }

    function writeSong (songArray, selector, htmlTemplate, writeOrder){
        let $parentElement = $(selector)
        songArray.forEach(function (songInfo, index) {
            $parentElement.append(generateHtml(songInfo,index,htmlTemplate,writeOrder))
        })
    }

    function generateHtml(songInfo,index,htmlTemplate,writeOrder){
        let {songName, singer, album, sq, id} = songInfo
        let newTemplate = htmlTemplate;
        let quote = ''
        if (songName.match(/\(.*\)/)) {
            quote = songName.match(/\(.*\)/)[0]
            songName = songName.replace(/\(.*\)/, '')
        }
        if (writeOrder) {
            let order = index + 1
            order = order < 10 ? '0' + order : order + ''
            newTemplate = newTemplate.replace(/\{\{order}}/g, order)
        }

        return newTemplate.replace(/\{\{songName}}/g, songName)
            .replace(/\{\{quote}}/g, quote)
            .replace(/\{\{singer}}/g, singer)
            .replace(/\{\{album}}/g, album)
            .replace(/\{\{sq}}/g, sq)
            .replace(/\{\{id}}/g, id)
    }
    app.writeSong = writeSong
}(jQuery, AV, window.app)
