let objectID = window.location.search.match(/^\?id=(.*)/)[1]
var query = new AV.Query('Song');
//载入歌词
query.get(objectID).then(function (songInfo) {
    var timeArray = []
    let {songName,singer,mp3,cover,lyric} = songInfo.attributes
    $('.page>.background').css('background-image',`url(${cover})`)
    $('head').append(`<title>${songName}-${singer}-在线试听-网易云音乐</title>`)
    $('.song-name>.name').text(songName)
    $('.song-name>.dash').text('-')
    $('.song-name>.singer').text(singer)
    $('.disc>.song-poster').css('background-image',`url(${cover})`)
    $('.media>audio').attr('src',mp3)
    var lyricObject =window.JSON.parse(lyric)
    var origin = lyricObject.lyric
    var translation = lyricObject.translation
    var ul = $('.lyric-list')
    //没有歌词的情况
    if (!origin){
        var item =`
            <li class="lyric-item">
                <span class="lyric-origin">暂无歌词</span>
                <span class="lyric-translation">&nbsp;</span>
            </li>`
        ul.append(item)
        $('.lyric-viewbox').addClass('no-lyric')
        return
    }
    var originSentences = origin.split('\n')
    //没有翻译的情况
    if(!translation){
        originSentences.forEach(function(sentence){
            if (!sentence){return}
            var regex = /(?:\[)(\d\d):(\d+\.\d+)(?:\])(.*)/
            var matches = sentence.match(regex)
            if(matches){
                var minute = +matches[1]
                var seconds = +matches[2]
                var text = matches[3] || '&nbsp;'
            }
            var item =`
            <li class="lyric-item">
                <span class="lyric-origin">${text}</span>
            </li>`
            ul.append(item)
            timeArray.push(60*minute+seconds)
        });
        $('.media>audio').on('timeupdate',function(e){
            var currentTime = e.currentTarget.currentTime
            $('.lyric-item').eq(0).addClass('turnWhite')
            for(let i=0; i<timeArray.length; i++) {
                if (i === timeArray.length - 1) {
                    $('.lyric-list').css('transform', `translateY(-${32 * i - 32}px)`)
                    $('.lyric-item').eq(i - 1).removeClass('turnWhite')
                } else if (timeArray[i] <= currentTime && timeArray[i + 1] > currentTime) {
                    $('.lyric-list').css('transform', `translateY(-${32 * i - 32}px)`)
                    $('.lyric-item').eq(i - 1).removeClass('turnWhite')
                    $('.lyric-item').eq(i).addClass('turnWhite')
                    break;
                } else if (currentTime < timeArray[0]) {
                    $('.lyric-list').css('transform', `translateY(-${32 * i - 32}px)`)
                    $('.lyric-item').eq(i - 1).removeClass('turnWhite')
                    $('.lyric-item').eq(i).addClass('turnWhite')
                    break
                }
            }
        })
        return
    }
    //有歌词并且带有翻译的情况
    var translationSentences = translation.split('\n')
    var translationObject = {}
    translationSentences.forEach(function(sentence){
        if(!sentence){return}
        var regex = /(?:\[)(\d\d):(\d+\.\d+)(?:\])(.*)/
        var translationMatches = sentence.match(regex)
        var translationTime = (+translationMatches[1])*60 + (+translationMatches[2])
        var translationText = translationMatches && translationMatches[3] || '&nbsp;'
        translationObject[translationTime] = translationText
    })
    originSentences.forEach(function(sentence,index){
        if (!sentence){return}
        var regex = /(?:\[)(\d\d):(\d+\.\d+)(?:\])(.*)/
        var originMatches = sentence.match(regex)
        var originTime = (+originMatches[1])*60 + (+originMatches[2])
        var originText = originMatches[3] || '&nbsp;'
        var translationText = translationObject[originTime] || '&nbsp;'
        var item =`
                <li class="lyric-item">
                    <span class="lyric-origin">${originText}</span>
                    <span class="lyric-translation">${translationText}</span>
                </li>`
        ul.append(item)
        $('.lyric-viewbox').addClass('with-translation')
        timeArray.push(originTime)
    });
    $('.media>audio').on('timeupdate',function(e){
        var currentTime = e.currentTarget.currentTime
        $('.lyric-item').eq(0).addClass('turnWhite')
        for(let i=0; i<timeArray.length; i++){
            if(i === timeArray.length - 1){
                $('.lyric-list').css('transform',`translateY(-${49*i}px)`)
                $('.lyric-item').eq(i-1).removeClass('turnWhite')
            }else if(timeArray[i] <= currentTime && timeArray[i+1] > currentTime){
                $('.lyric-list').css('transform',`translateY(-${49*i}px)`)
                $('.lyric-item').eq(i-1).removeClass('turnWhite')
                $('.lyric-item').eq(i).addClass('turnWhite')
                break;
            }else if(currentTime < timeArray[0]){
                $('.lyric-list').css('transform',`translateY(-${49*i}px)`)
                $('.lyric-item').eq(i-1).removeClass('turnWhite')
                $('.lyric-item').eq(i).addClass('turnWhite')
                break
            }
        }
    })
}, function (error) {
    console.log(error)
});

$('.media>audio').on('canplay',function(e){
    $('.disc>.song-poster>.control').addClass('canplay')
})
$('.media>audio').on('ended',function(e){
    $('.disc').removeClass('active')
    $('.disc>.song-poster').css('animation','none')
    $('.lyric-list').css('transform','translateY(0px)')
    $('.lyric-item').eq(0).addClass('turnWhite')
})

$('.control').on('click',function(e){
    $('.disc').toggleClass('active')
    if($('.disc.active').length){
        $('.media>audio')[0].play()
        $('.disc>.song-poster').css('animation','circle 20s linear infinite')

    }else{
        $('.media>audio')[0].pause()
        $('.disc>.song-poster').css('animation','circle 20s linear infinite paused')
    }
})
