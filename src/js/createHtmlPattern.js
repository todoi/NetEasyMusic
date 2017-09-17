//create songList pattern html
!function(app){
    function createHtmlPattern (writeOrder){
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
    app.createHtmlPattern = createHtmlPattern
}(window.app)
