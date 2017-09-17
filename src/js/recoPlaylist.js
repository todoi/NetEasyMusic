//推荐歌单写入
!function($, AV){
    main()

    function main(){
        findPlaylist('RecommendPlaylist').then(function (lists) {
            lists = lists.slice(0, 6)
            writePlaylist(lists)
        }).then(fullfilled, rejected);
    }

    function findPlaylist(objectName){
        var recommendPlaylist = new AV.Query(objectName);
        return recommendPlaylist.find()
    }

    function writePlaylist(lists){
        let $recoPlaylist = $('.recoPlaylist')
        lists.forEach(function (list, index) {
            let $element = $($recoPlaylist[index])
            $element.attr({'href': `./playlist.html?id=${list.id}`, 'alt': list.attributes.title})
            insertImage($element.find('.count'),list.attributes.poster)
            insertText($element, list)
        });
    }

    function insertImage(selector,url){
        let img = new Image()
        img.src = url
        $(img).insertBefore(selector)
    }

    function insertText(parentSelector, list){
        let {title, count, champion} = list.attributes
        let $count = parentSelector.find('.count')
        let $champion = parentSelector.find('.poster>i')
        let $title = parentSelector.find('p')
        $count.text(count)
        champion === 'true' && $champion.addClass('champion')
        $title.text(title)
    }

    function fullfilled(){
        $('.recoPlaylists-container').removeClass('loading')
    }
    function rejected(error){
        console.log(error)
    }

}(jQuery,AV)

