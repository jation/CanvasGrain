define(function(require, exports, module) {
    /*
    ImgLoader(arrPreLoadImg, function (o) {
        //o is process from 0 to 1
        if (o == 1) {
            alert("all loaded");
        }
    });
    * */
    var loadImg = function(imgArr, callback, timeout){
        var waitTime  = timeout || 5000;

        // 加载图片数量
        var len = imgArr.length;
        if(len <= 0 ){
            return;
        }

        // 已完成加载计数
        var loaded = 0;

        var imgList = [];


        var loadFun = function(evt) {
            var type = {'load': 1, 'error': 2}[evt.type];


            // 已加载计数，用于计算完成百分比
            if (loaded < len) {
                ++loaded;
                callback(loaded/len);
            }
        };

        for(var i = 0; i<len; i++){
            imgList[i] = new Image();

            imgList[i].onload = function() {
                loadFun({type: 1});
            };
            imgList[i].onerror = function() {
                loadFun({type: 2});
            };

            // 发送请求
            imgList[i].src = imgArr[i];
        }

        //超时处理
        setTimeout(function() {
            if(loaded < len){
                callback(1);
                // 强制加载完成
                loaded = len;

            }
        }, waitTime*len);


    };

    module.exports = loadImg;

});