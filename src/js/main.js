window.app.toggleSearchPage = toggleSearchPage

//tab切换 推荐歌单 | 热榜 | 搜索
$('.tabNav>li').on('click', function (e) {
    var $element = $(e.currentTarget)
    var index = $element.index()
    $element.siblings().removeClass('active')
        .end().addClass('active')
        .parent().parent()
        .find('.tabContent')
        .children().removeClass('active')
        .eq(index).addClass('active')
})

//搜索页面切换 recommendSearch | nameResult | allResult
function toggleSearchPage (activeTabSelector){
    $('.showSearch>li').removeClass('active')
    $(activeTabSelector).addClass('active')
}


//监听热门搜索标签的click
$('.hotSearchValue>a').on('click',function (e){
    e.preventDefault()
    let $element = $(e.currentTarget)
    let text = $element.text()
    $('#searchInput').val(text)

    window.app.changeTextHolderAndEmpty(text)
    triggerEnter($('#searchInput'))
})

function triggerEnter($element){
    var keyDownEvent = jQuery.Event('keypress');
    // # Some key code value
    keyDownEvent.which = 13;
    $element.trigger(keyDownEvent);
}

// 搜索框清空
$('.textInput>.empty').on('click', function (e) {
    var $textHolder = $('.textInput>.textHolder')
    var $empty = $('.textInput>.empty')
    $('#searchInput')[0].value = null
    $textHolder.text('搜索歌曲、歌手、专辑')
    $empty.removeClass('active')
    window.app.toggleSearchPage('.showSearch>.recoSearch')

    //清空搜索字符
    $('.nameResult>h4.scaleBorder>span').text('')
})

//监听搜索歌名结果的click
$('.nameResult>.searchList').on('click', '.searchItem', function (e) {
    e.preventDefault()
    $('.textInput>.empty').click()
    let url = $(e.target).closest('.searchItem').attr('href')
    window.open(url, '_self')
})

//监听历史记录的click
$('.history>.searchList').on('click','.searchItem',function (e){
    let $element = $(e.currentTarget)
    let $close = $element.find('.close')
    let text = $element.find('.value').text()
    $('#searchInput').val(text)
    $('#searchInput').change()

    var $textHolder = $('.textInput>.textHolder')
    var $empty = $('.textInput>.empty')
    $textHolder.text('')
    //输入字符就让清空按钮出现
    $empty.addClass('active')

    var keyDownEvent = jQuery.Event('keypress');
    // # Some key code value
    keyDownEvent.which = 13;
    $('#searchInput').trigger(keyDownEvent);

    $close.click()
    }
)

//监听 X 图标
$('.history>.searchList').on('click','.value-container>.close',function (e){
    e.stopPropagation()
    var $element = $(e.target)
    var $li = $element.closest('.history>.searchList>.searchItem')
    $li.remove()
})

//最新音乐载入
window.app.loadSonglist('59a8f8d8570c35006b1cb153',false,'.latestMusic','.latestMusic')
//热歌榜列表载入
window.app.loadSonglist('59a8f8e01b69e60064127cb7',true,'.songList','.pageHotList')

