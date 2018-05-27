"use strict";function toggleSearchTab(e){$(".showSearch>li").removeClass("active"),$(e).addClass("active")}function queryAndWrite(e,t,n,a){return e.find().then(function(e){if(e.length){var s=[];e.forEach(function(e){var t=e.attributes;t.id=e.id,s.push(t)}),writeSong(s,n,t)}else{var r='<div class="prompt">'+a+"<div>";$(n).html(r)}},function(e){console.log(e)})}function queryWhat(e,t,n){return n=n||"Song",new AV.Query(n).contains(e,t)}function createHtmlPattern(e){return e?'\n                <a href="./song.html?id={{id}}" class="scaleBorder songInfo-container">\n                    <div class="order">{{order}}</div>\n                    <div class="songInfo">\n                        <h3 class="songName">{{songName}} <span>{{quote}}</span></h3>\n                        <p class="singerAlbum">\n                            <svg class="icon {{sq}}" aria-hidden="true">\n                                <use xlink:href="#icon-sq"></use>\n                            </svg>\n                            <span class="singer">{{singer}}{{album}}</span>\n                        </p>\n                    </div>\n                    <div class="playButton">\n                        <svg class="icon" aria-hidden="false">\n                            <use xlink:href="#icon-play"></use>\n                        </svg>\n                    </div>\n                    </a> ':'<a href="./song.html?id={{id}}" class="scaleBorder songInfo-container">\n                    <div class="songInfo">\n                        <h3 class="songName">{{songName}} <span>{{quote}}</span></h3>\n                        <p class="singerAlbum">\n                            <svg class="icon {{sq}}" aria-hidden="true">\n                                <use xlink:href="#icon-sq"></use>\n                            </svg>\n                            <span class="singer">{{singer}}{{album}}</span>\n                        </p>\n                    </div>\n                    <div class="playButton">\n                        <svg class="icon" aria-hidden="false">\n                            <use xlink:href="#icon-play"></use>\n                        </svg>\n                    </div>\n                </a> '}function getPlaylist(e){var t=new AV.Query("Playlist");return t.get(e).then(function(e){var t=e.attributes.content;return window.JSON.parse(t)},function(e){console.log(e)})}function getSongInfo(e){var t=e.playlist,n=e.selector,a=e.html,s=e.callback,r=e.writeOrder,c=[],i=[],l=[];return t.then(function(e){var t=e.length;return e.forEach(function(e,o){var u=new AV.Query("Song"),h=u.startsWith("songId",e+"").find().then(function(e){if(e.length){var l=e[0],u=l.attributes,h=l.id;u.id=h,c[o]=u}i.push(1),i.length===t&&s(c,n,a,r)},function(e){console.log(e),c[o]=null,i.push(1),i.length===t&&s(c,n,a,r)});l.push(h)}),Promise.all(l)},function(e){console.log(e)})}function writeSong(e,t,n,a){var s=$(t);e.forEach(function(e,t){var r=e.songName,c=e.singer,i=e.album,l=e.sq,o=e.id,u=n,h="";if(r.match(/\(.*\)/)&&(h=r.match(/\(.*\)/)[0],r=r.replace(/\(.*\)/,"")),a){var d=t+1;d=d<10?"0"+d:d+"",u=u.replace(/\{\{order}}/g,d)}u=u.replace(/\{\{songName}}/g,r).replace(/\{\{quote}}/g,h).replace(/\{\{singer}}/g,c).replace(/\{\{album}}/g,i).replace(/\{\{sq}}/g,l).replace(/\{\{id}}/g,o),s.append(u)})}!function(){AV.init({appId:"YQ4yjuFRLMM8TRf2w3pSr3QH-gzGzoHsz",appKey:"oBQKY2jc2MYHDcxLP3QoLxtL"})}(),$(".tabNav>li").on("click",function(e){var t=$(e.currentTarget),n=t.index();t.siblings().removeClass("active").end().addClass("active").parent().parent().find(".tabContent").children().removeClass("active").eq(n).addClass("active")}),$("#searchInput").on("input",function(e){var t=$(e.currentTarget),n=$(".textInput>.textHolder"),a=$(".textInput>.empty"),s=t[0].value;toggleSearchTab(s?".showSearch>.nameResult":".showSearch>.recoSearch"),s?n.text(""):n.text("搜索歌曲、歌手、专辑"),s?a.addClass("active"):a.removeClass("active"),$(".nameResult>h4.scaleBorder>span").text(t[0].value)});var clock;$("#searchInput").on("input",function(e){var t=$(e.currentTarget),n=t[0].value;clock&&window.clearTimeout(clock),clock=setTimeout(function(){if($(".nameResult>.searchList").html(""),n.trim()){var e=new AV.Query("Song");e.contains("songName",n);queryAndWrite(e,'\n                <a href="./song.html?id={{id}}" class="searchItem">\n                    <i class="searchIcon"></i>\n                    <div class="value-container scaleBorder">\n                        <div class="value">{{songName}}</div>\n                    </div>\n                </a>',".nameResult>.searchList","请按回车键查看更多")}},300)}),$(".textInput>.empty").on("click",function(e){var t=$(".textInput>.textHolder"),n=$(".textInput>.empty");$("#searchInput")[0].value=null,t.text("搜索歌曲、歌手、专辑"),n.removeClass("active"),toggleSearchTab(".showSearch>.recoSearch"),$(".nameResult>h4.scaleBorder>span").text("")}),$("#searchInput").on("keypress",function(e){$(".allResult").html("");var t=$("#searchInput").val();if(t.trim()){if(13===(e.which||e.keyCode)){$(".allResult").addClass("loading"),toggleSearchTab(".showSearch>.allResult");var n=queryWhat("songName",t),a=queryWhat("signer",t),s=queryWhat("ablum",t);queryAndWrite(AV.Query.or(n,a,s),createHtmlPattern(),".allResult","暂无搜索结果").then(function(){$(".allResult").removeClass("loading")},function(){$(".allResult").removeClass("loading")});var r='\n            <li class="searchItem">\n                <i class="historyIcon searchIcon"></i>\n                <div class="value-container scaleBorder">\n                    <div class="value">'+t+'</div>\n                    <i class="close"></i>\n                </div>\n            </li>',c=".history>.searchList";0===$(c).children().length?$(c).append(r):$($(".history>.searchList>.searchItem")[0]).before(r)}}}),$(".nameResult>.searchList").on("click",".searchItem",function(e){e.preventDefault(),$(".textInput>.empty").click();var t=$(e.target).closest(".searchItem").attr("href");window.open(t,"_self")}),$(".history>.searchList").on("click",".searchItem",function(e){var t=$(e.currentTarget),n=t.find(".close"),a=t.find(".value").text();$("#searchInput").val(a),$("#searchInput").change();var s=$(".textInput>.textHolder"),r=$(".textInput>.empty");s.text(""),r.addClass("active");var c=jQuery.Event("keypress");c.which=13,$("#searchInput").trigger(c),n.click()}),$(".hotSearchValue>a").on("click",function(e){e.preventDefault(),console.log(1);var t=$(e.currentTarget),n=t.text();$("#searchInput").val(n),$("#searchInput").change();var a=$(".textInput>.textHolder"),s=$(".textInput>.empty");a.text(""),s.addClass("active");var r=jQuery.Event("keypress");r.which=13,$("#searchInput").trigger(r)}),$(".history>.searchList").on("click",".value-container>.close",function(e){e.stopPropagation(),$(e.target).closest(".history>.searchList>.searchItem").remove()});var $recoPlaylist=$(".recoPlaylist"),recommendPlaylist=new AV.Query("RecommendPlaylist");recommendPlaylist.find().then(function(e){e=e.slice(0,6),e.forEach(function(e,t){var n=e.attributes,a=e.id,s=n.title,r=n.poster,c=n.count,i=n.champion,l=$($recoPlaylist[t]),o=new Image;o.src=r;var u=l.find(".count"),h=l.find(".poster>i");$(o).insertBefore(u);var d=l.find("p");l.attr({href:"./playlist.html?id="+a,alt:s}),u.text(c),"true"===i&&h.addClass("champion"),d.text(s)})}).then(function(e){},function(e){console.log(e)}).then(function(){$(".recoPlaylists-container").removeClass("loading")}),function(){getSongInfo({playlist:getPlaylist("59a8f8d8570c35006b1cb153"),html:createHtmlPattern(),selector:".latestMusic",callback:writeSong}).then(function(){$(".latestMusic").removeClass("loading")},function(){$(".latestMusic").removeClass("loading")})}(),function(){getSongInfo({playlist:getPlaylist("59a8f8e01b69e60064127cb7"),html:createHtmlPattern(!0),selector:".songList",callback:writeSong,writeOrder:!0}).then(function(){$(".pageHotList").removeClass("loading")},function(){$(".pageHotList").removeClass("loading")})}();