//监听回车
!function($, AV, app){
    $('#searchInput').on('keypress', function (e) {
        $('.allResult').html('')
        let text = $('#searchInput').val()
        if (!text.trim()){return}
        var key = e.which || e.keyCode;
        // 13 is enter
        if (key === 13) {
            $('.allResult').addClass('loading')
            window.app.toggleSearchPage('.showSearch>.allResult')
            let html = window.app.createHtmlPattern()
            window.app.queryAndWrite(createQuery(text), html, '.allResult','暂无搜索结果').then(
                function (){ $('.allResult').removeClass('loading')},
                function (){ $('.allResult').removeClass('loading')}
            )
            insertHtml(generateHTML(text))
        }
    }) ;

    function generateHTML(text){
        let html = `
            <li class="searchItem">
                <i class="historyIcon searchIcon"></i>
                <div class="value-container scaleBorder">
                    <div class="value">${text}</div>
                    <i class="close"></i>
                </div>
            </li>`
        return html
    }

    function insertHtml(html){
        let nextSibling = '.history>.searchList>.searchItem'
        let parentNode = '.history>.searchList'
        if($(parentNode).children().length === 0){
            $(parentNode).append(html)
        }else{
            $($(nextSibling)[0]).before(html)
        }
    }

    function createQuery(text){
        //query songname or singer or album
        var songNameQuery = queryWhat('songName',text)
        var singerQuery = queryWhat('signer',text)
        var albumQuery = queryWhat('ablum',text)
        return AV.Query.or(songNameQuery, singerQuery, albumQuery);
    }

    /**
     * 创建一个查询象
     * @param queryAttribute 要查的字符所属的属性
     * @param text 要查的字符
     * @param queryClass 属性所属的类,默认为Song
     * @returns {*|AV.Query|Query}
     */
    function queryWhat (queryAttribute,text,queryClass){
        queryClass = queryClass || 'Song'
        var songNameQuery = new AV.Query(queryClass);
        return songNameQuery.contains(queryAttribute, text);
    }
}(jQuery, AV, window.app)
