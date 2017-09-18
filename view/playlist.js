let objectID = window.location.search.match(/(?:^\?id=)(.*)/)[1]
var query = new AV.Query('RecommendPlaylist');
query.get(objectID).then(function (playlist) {
    let {author,avatar,poster,count,content,description,link,tag,title} = playlist.attributes
    $('head').append(`<title>${title} - 网易云音乐</title>`)
    $('header').find('.header-background').css('backgroundImage',`url(${poster})`).end()
        .find('.poster').css('backgroundImage',`url(${poster})`)
        .find('.count').text(count).end().end()
        .find('.title-wrapper')
        .find('.title').text(title).end()
        .find('.author-link').attr('href',link)
        .find('.avatar').css('backgroundImage',`url(${avatar})`).end()
        .find('.author').text(author)
    window.JSON.parse(tag).forEach(function(tagItem,index){
        $('.tags>.tag-item')[index].innerText = tagItem
    })
    let textList = window.JSON.parse(description)
    textList.forEach(function(text){
        let html = `<span class="text">${text}</span>`
        $('.description>.text-wrapper').append(html)
    })
},function(error){console.log(error)})

$('.description>.arrow').on('click',function(e){
    $('.description>.text-wrapper').toggleClass('active')
})

!function () {
    let playlist = getPlaylist(objectID)
    let html =createHtmlPattern(true)
    let args = {playlist: playlist, html: html, selector: '.songList', callback: writeSong, writeOrder: true}
    getSongInfo(args).then(function(){$('.playlist-wrapper').removeClass('loading')} ,
        function(){$('.playlist-wrapper').removeClass('loading')}
        )
}()

function getPlaylist(objectId) {
    let playlist = new AV.Query('RecommendPlaylist')
    let promise
    promise = playlist.get(objectId).then(function (song) {
        let content = song.attributes.content
        let contentArr
        contentArr = window.JSON.parse(content)
        return contentArr
    }, function (error) {
        console.log(error)
    })
    return promise
}
function createHtmlPattern(writeOrder){
    let html
    if (writeOrder){
        html = `
                <a href="./song.html?id={{id}}" class="scaleBorder songInfo-container">
                    <div class="order">{{order}}</div>
                    <div class="songInfo">
                        <h3 class="songName">{{songName}} <span>{{quote}}</span></h3>
                        <p class="singerAlbum">
                            <svg class="icon {{sq}}" aria-hidden="true">
                                <use xlink:href="#icon-sq"></use>
                            </svg>
                            <span class="singer">{{singer}}{{album}}</span>
                        </p>
                    </div>
                    <div class="playButton">
                        <svg class="icon" aria-hidden="false">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </div>
                    </a> `
    }else{
        html = `<a href="./song.html?id={{id}}" class="scaleBorder songInfo-container">
                    <div class="songInfo">
                        <h3 class="songName">{{songName}} <span>{{quote}}</span></h3>
                        <p class="singerAlbum">
                            <svg class="icon {{sq}}" aria-hidden="true">
                                <use xlink:href="#icon-sq"></use>
                            </svg>
                            <span class="singer">{{singer}}{{album}}</span>
                        </p>
                    </div>
                    <div class="playButton">
                        <svg class="icon" aria-hidden="false">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </div>
                </a> `
    }
    return html
}
function getSongInfo(args) {
    let {playlist, selector, html, callback, writeOrder} = args
    let orderArray = []
    let countIndex = []
    let promiseAll = []
    return playlist.then(function (list) {
        let listLength = list.length
        list.forEach(function (songId, index) {
            let song = new AV.Query('Song');
            let promise = song.startsWith('songId', songId + '').find().then(function (array) {
                //array 有可能返回空数组
                if (array.length) {
                    let {attributes:songInfo, id} = array[0]
                    songInfo.id = id
                    orderArray[index] = songInfo
                }
                countIndex.push(1)
                countIndex.length === listLength && callback(orderArray, selector, html, writeOrder)
            }, function (error) {
                console.log(error);
                orderArray[index] = null;
                countIndex.push(1)
                countIndex.length === listLength && callback(orderArray, selector, html, writeOrder)
            })
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }, function (error) {
        console.log(error)
    })
}
function writeSong(orderArray, selector, html, writeOrder) {
    let $parentElement = $(selector)
    orderArray.forEach(function (songInfo, index) {
        let {songName, singer, album, sq, id} = songInfo
        let newHtml = html;
        let quote = ''
        if (songName.match(/\(.*\)/)) {
            quote = songName.match(/\(.*\)/)[0]
            songName = songName.replace(/\(.*\)/, '')
        }
        if (writeOrder) {
            let order = index + 1
//                order = order < 10 ? '0' + order : order + ''
            newHtml = newHtml.replace(/\{\{order}}/g, order)
        }
        newHtml = newHtml.replace(/\{\{songName}}/g, songName)
            .replace(/\{\{quote}}/g, quote)
            .replace(/\{\{singer}}/g, singer)
            .replace(/\{\{album}}/g, album)
            .replace(/\{\{sq}}/g, sq)
            .replace(/\{\{id}}/g, id);
        $parentElement.append(newHtml)
    })
}
