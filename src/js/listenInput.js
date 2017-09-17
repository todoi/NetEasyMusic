!function($, AV, window){
    //显示搜索歌名的结果
    window.app.changeTextHolderAndEmpty = changeTextHolderAndEmpty
    window.app.queryAndWrite = queryAndWrite

    var timer
    $('#searchInput').on('input', function (e) {
        var text = $(e.currentTarget)[0].value
        if(timer){ window.clearTimeout(timer) }
        timer = setTimeout(function (){
            timer = null
            $('.nameResult>.searchList').html('')
            text.trim() && queryAndWrite( songNameQuery(text), generateHTML(), '.nameResult>.searchList', '请按回车键查看更多' )
        },300)
    })

    //搜索框输入
    $('#searchInput').on('input', function (e) {
        var text = $(e.currentTarget)[0].value
        changeTextHolderAndEmpty(text)
        text ? window.app.toggleSearchPage('.showSearch>.nameResult') : window.app.toggleSearchPage('.showSearch>.recoSearch')
        //显示搜索字符
        $('.nameResult>h4.scaleBorder>span').text(text)
    })

    function changeTextHolderAndEmpty(text){
        var $textHolder = $('.textInput>.textHolder')
        var $empty = $('.textInput>.empty')
        //toggle text holder
        text ? $textHolder.text('') : $textHolder.text('搜索歌曲、歌手、专辑')
        //输入字符就让清空按钮出现
        text ? $empty.addClass('active') : $empty.removeClass('active')
    }

    function generateHTML(){
        let html = `
                <a href="./song.html?id={{id}}" class="searchItem">
                    <i class="searchIcon"></i>
                    <div class="value-container scaleBorder">
                        <div class="value">{{songName}}</div>
                    </div>
                </a>`
        return html
    }

    function songNameQuery(text){
        var query = new AV.Query('Song');
        return query.contains('songName', text);
    }

    //查找搜索结果并写入
    function queryAndWrite (query,html,parentSelector,prompt){
        return query.find().then(function (result) {
            if (result.length) {
                let orderArr = []
                result.forEach((songObject)=>{
                    let songInfo = songObject.attributes
                    songInfo.id = songObject.id
                    orderArr.push(songInfo)
                })
                window.app.writeSong(orderArr, parentSelector, html)
            } else {
                let html = `<div class="prompt">${prompt}<div>`
                $(parentSelector).html(html)
            }
        },function (error){ console.log(error) })
    }
}(jQuery, AV, window)
