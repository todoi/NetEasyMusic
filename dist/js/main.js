
use strict';

//init leanClound
(function () {
    var APP_ID = 'YQ4yjuFRLMM8TRf2w3pSr3QH-gzGzoHsz';
    var APP_KEY = 'oBQKY2jc2MYHDcxLP3QoLxtL';
    AV.init({ appId: APP_ID, appKey: APP_KEY });
})();

//tab切换 推荐歌单 | 热榜 | 搜索
$('.tabNav>li').on('click', function (e) {
    var $element = $(e.currentTarget);
    var index = $element.index();
    $element.siblings().removeClass('active').end().addClass('active').parent().parent().find('.tabContent').children().removeClass('active').eq(index).addClass('active');
});

//搜索页面的tab切换 recommendSearch | nameResult | allResult
function toggleSearchTab(activeTabSelector) {
    $('.showSearch>li').removeClass('active');
    $(activeTabSelector).addClass('active');
}

//查找搜索结果并写入
function queryAndWrite(query, html, parentSelector, prompt) {
    return query.find().then(function (result) {
        if (result.length) {
            var orderArr = [];
            result.forEach(function (songObject) {
                var songInfo = songObject.attributes;
                songInfo.id = songObject.id;
                orderArr.push(songInfo);
            });
            writeSong(orderArr, parentSelector, html);
        } else {
            var _html = '<div class="prompt">' + prompt + '<div>';
            $(parentSelector).html(_html);
        }
    }, function (error) {
        console.log(error);
    });
}

//搜索框输入
$('#searchInput').on('input', function (e) {
    var $element = $(e.currentTarget);
    var $textHolder = $('.textInput>.textHolder');
    var $empty = $('.textInput>.empty');
    var text = $element[0].value;
    //切换热门搜索页面和搜索结果页面
    text ? toggleSearchTab('.showSearch>.nameResult') : toggleSearchTab('.showSearch>.recoSearch');
    //toggle text holder
    text ? $textHolder.text('') : $textHolder.text('搜索歌曲、歌手、专辑');
    //输入字符就让清空按钮出现
    text ? $empty.addClass('active') : $empty.removeClass('active');
    //显示搜索字符
    $('.nameResult>h4.scaleBorder>span').text($element[0].value);
});

//显示搜索歌名的结果
var clock;
$('#searchInput').on('input', function (e) {
    var $element = $(e.currentTarget);
    var text = $element[0].value;
    if (clock) {
        window.clearTimeout(clock);
    }
    clock = setTimeout(function () {
        $('.nameResult>.searchList').html('');
        if (text.trim()) {
            var songNameQuery = new AV.Query('Song');
            songNameQuery.contains('songName', text);
            var html = '\n                <a href="./song.html?id={{id}}" class="searchItem">\n                    <i class="searchIcon"></i>\n                    <div class="value-container scaleBorder">\n                        <div class="value">{{songName}}</div>\n                    </div>\n                </a>';
            var prompt = '请按回车键查看更多';
            var parentSelector = '.nameResult>.searchList';
            queryAndWrite(songNameQuery, html, parentSelector, prompt);
        }
    }, 300);
});

// 搜索框清空
$('.textInput>.empty').on('click', function (e) {
    var $textHolder = $('.textInput>.textHolder');
    var $empty = $('.textInput>.empty');
    $('#searchInput')[0].value = null;
    $textHolder.text('搜索歌曲、歌手、专辑');
    $empty.removeClass('active');
    toggleSearchTab('.showSearch>.recoSearch');

    //清空搜索字符
    $('.nameResult>h4.scaleBorder>span').text('');
});

//监听回车
$('#searchInput').on('keypress', function (e) {
    $('.allResult').html('');
    var text = $('#searchInput').val();
    if (!text.trim()) {
        return;
    }
    var key = e.which || e.keyCode;
    // 13 is enter
    if (key === 13) {
        $('.allResult').addClass('loading');
        toggleSearchTab('.showSearch>.allResult');

        //query songname or singer or album
        var songNameQuery = queryWhat('songName', text);
        var singerQuery = queryWhat('signer', text);
        var albumQuery = queryWhat('ablum', text);
        var query = AV.Query.or(songNameQuery, singerQuery, albumQuery);

        var html = createHtmlPattern();
        var parentSelector = '.allResult';
        var prompt = '暂无搜索结果';
        queryAndWrite(query, html, parentSelector, prompt).then(function () {
            $('.allResult').removeClass('loading');
        }, function () {
            $('.allResult').removeClass('loading');
        });

        var historyHtml = '\n            <li class="searchItem">\n                <i class="historyIcon searchIcon"></i>\n                <div class="value-container scaleBorder">\n                    <div class="value">' + text + '</div>\n                    <i class="close"></i>\n                </div>\n            </li>';
        var nextSibling = '.history>.searchList>.searchItem';
        var parentNode = '.history>.searchList';
        if ($(parentNode).children().length === 0) {
            $(parentNode).append(historyHtml);
        } else {
            $($(nextSibling)[0]).before(historyHtml);
        }
    }
});

/**
 * 创建一个查询象
 * @param queryAttribute 要查的字符所属的属性
 * @param text 要查的字符
 * @param queryClass 属性所属的类,默认为Song
 * @returns {*|AV.Query|Query}
 */
function queryWhat(queryAttribute, text, queryClass) {
    queryClass = queryClass || 'Song';
    var songNameQuery = new AV.Query(queryClass);
    return songNameQuery.contains(queryAttribute, text);
}

//监听搜索歌名结果的click
$('.nameResult>.searchList').on('click', '.searchItem', function (e) {
    e.preventDefault();
    $('.textInput>.empty').click();
    var url = $(e.target).closest('.searchItem').attr('href');
    window.open(url, '_self');
});

//监听历史记录的click
$('.history>.searchList').on('click', '.searchItem', function (e) {
    var $element = $(e.currentTarget);
    var $close = $element.find('.close');
    var text = $element.find('.value').text();
    $('#searchInput').val(text);
    $('#searchInput').change();

    var $textHolder = $('.textInput>.textHolder');
    var $empty = $('.textInput>.empty');
    $textHolder.text('');
    //输入字符就让清空按钮出现
    $empty.addClass('active');

    var keyDownEvent = jQuery.Event('keypress');
    // # Some key code value
    keyDownEvent.which = 13;
    $('#searchInput').trigger(keyDownEvent);

    $close.click();
});
//监听热门搜索标签的click
$('.hotSearchValue>a').on('click', function (e) {
    e.preventDefault();
    console.log(1);
    var $element = $(e.currentTarget);
    var text = $element.text();
    $('#searchInput').val(text);
    $('#searchInput').change();

    var $textHolder = $('.textInput>.textHolder');
    var $empty = $('.textInput>.empty');
    $textHolder.text('');
    //输入字符就让清空按钮出现
    $empty.addClass('active');

    var keyDownEvent = jQuery.Event('keypress');
    // # Some key code value
    keyDownEvent.which = 13;
    $('#searchInput').trigger(keyDownEvent);
});

//监听 X 图标
$('.history>.searchList').on('click', '.value-container>.close', function (e) {
    e.stopPropagation();
    var $element = $(e.target);
    var $li = $element.closest('.history>.searchList>.searchItem');
    $li.remove();
});

//推荐歌单写入
var $recoPlaylist = $('.recoPlaylist');
var recommendPlaylist = new AV.Query('RecommendPlaylist');
recommendPlaylist.find().then(function (lists) {
    lists = lists.slice(0, 6);
    lists.forEach(function (list, index) {
        var attributes = list.attributes,
            id = list.id;
        var title = attributes.title,
            poster = attributes.poster,
            count = attributes.count,
            champion = attributes.champion;

        var $element = $($recoPlaylist[index]);
        var img = new Image();
        img.src = poster;
        var $count = $element.find('.count');
        var $champion = $element.find('.poster>i');
        $(img).insertBefore($count);
        var $title = $element.find('p');
        $element.attr({ 'href': './playlist.html?id=' + id, 'alt': title });
        $count.text(count);
        champion === 'true' && $champion.addClass('champion');
        $title.text(title);
    });
}).then(function (lists) {/* 更新成功*/
}, function (error) {
    /* 异常处理*/
    console.log(error);
}).then(function () {
    $('.recoPlaylists-container').removeClass('loading');
});

//create songList pattern html
function createHtmlPattern(writeOrder) {
    var html = void 0;
    if (writeOrder) {
        html = '\n                <a href="./song.html?id={{id}}" class="scaleBorder songInfo-container">\n                    <div class="order">{{order}}</div>\n                    <div class="songInfo">\n                        <h3 class="songName">{{songName}} <span>{{quote}}</span></h3>\n                        <p class="singerAlbum">\n                            <svg class="icon {{sq}}" aria-hidden="true">\n                                <use xlink:href="#icon-sq"></use>\n                            </svg>\n                            <span class="singer">{{singer}}{{album}}</span>\n                        </p>\n                    </div>\n                    <div class="playButton">\n                        <svg class="icon" aria-hidden="false">\n                            <use xlink:href="#icon-play"></use>\n                        </svg>\n                    </div>\n                    </a> ';
    } else {
        html = '<a href="./song.html?id={{id}}" class="scaleBorder songInfo-container">\n                    <div class="songInfo">\n                        <h3 class="songName">{{songName}} <span>{{quote}}</span></h3>\n                        <p class="singerAlbum">\n                            <svg class="icon {{sq}}" aria-hidden="true">\n                                <use xlink:href="#icon-sq"></use>\n                            </svg>\n                            <span class="singer">{{singer}}{{album}}</span>\n                        </p>\n                    </div>\n                    <div class="playButton">\n                        <svg class="icon" aria-hidden="false">\n                            <use xlink:href="#icon-play"></use>\n                        </svg>\n                    </div>\n                </a> ';
    }
    return html;
}

//音乐列表载入函数
function getPlaylist(objectId) {
    var playlist = new AV.Query('Playlist');
    var promise = void 0;
    promise = playlist.get(objectId).then(function (song) {
        var content = song.attributes.content;
        var contentArr = void 0;
        contentArr = window.JSON.parse(content);
        return contentArr;
    }, function (error) {
        console.log(error);
    });
    return promise;
}
function getSongInfo(args) {
    var playlist = args.playlist,
        selector = args.selector,
        html = args.html,
        callback = args.callback,
        writeOrder = args.writeOrder;

    var orderArray = [];
    var countIndex = [];
    var promiseAll = [];
    return playlist.then(function (list) {
        var listLength = list.length;
        list.forEach(function (songId, index) {
            var song = new AV.Query('Song');
            var promise = song.startsWith('songId', songId + '').find().then(function (array) {
                //array 有可能返回空数组
                if (array.length) {
                    var _array$ = array[0],
                        songInfo = _array$.attributes,
                        id = _array$.id;

                    songInfo.id = id;
                    orderArray[index] = songInfo;
                }
                countIndex.push(1);
                countIndex.length === listLength && callback(orderArray, selector, html, writeOrder);
            }, function (error) {
                console.log(error);
                orderArray[index] = null;
                countIndex.push(1);
                countIndex.length === listLength && callback(orderArray, selector, html, writeOrder);
            });
            promiseAll.push(promise);
        });
        return Promise.all(promiseAll);
    }, function (error) {
        console.log(error);
    });
}
function writeSong(orderArray, selector, html, writeOrder) {
    var $parentElement = $(selector);
    orderArray.forEach(function (songInfo, index) {
        var songName = songInfo.songName,
            singer = songInfo.singer,
            album = songInfo.album,
            sq = songInfo.sq,
            id = songInfo.id;

        var newHtml = html;
        var quote = '';
        if (songName.match(/\(.*\)/)) {
            quote = songName.match(/\(.*\)/)[0];
            songName = songName.replace(/\(.*\)/, '');
        }
        if (writeOrder) {
            var order = index + 1;
            order = order < 10 ? '0' + order : order + '';
            newHtml = newHtml.replace(/\{\{order}}/g, order);
        }
        newHtml = newHtml.replace(/\{\{songName}}/g, songName).replace(/\{\{quote}}/g, quote).replace(/\{\{singer}}/g, singer).replace(/\{\{album}}/g, album).replace(/\{\{sq}}/g, sq).replace(/\{\{id}}/g, id);
        $parentElement.append(newHtml);
    });
}

//最新音乐载入
(function () {
    var playlist = getPlaylist('59a8f8d8570c35006b1cb153');
    var html = createHtmlPattern();
    var args = { playlist: playlist, html: html, selector: '.latestMusic', callback: writeSong };
    getSongInfo(args).then(function () {
        $('.latestMusic').removeClass('loading');
    }, function () {
        $('.latestMusic').removeClass('loading');
    });
})();
//热歌榜列表载入

(function () {
    var playlist = getPlaylist('59a8f8e01b69e60064127cb7');
    var html = createHtmlPattern(true);
    var args = { playlist: playlist, html: html, selector: '.songList', callback: writeSong, writeOrder: true };
    getSongInfo(args).then(function () {
        $('.pageHotList').removeClass('loading');
    }, function () {
        $('.pageHotList').removeClass('loading');
    });
})();
