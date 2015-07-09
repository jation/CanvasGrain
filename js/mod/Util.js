define(function(require, exports, module) {
    (function(){
        Array.prototype.remove = function(index){
            if(typeof index == 'undefined'){
                return [];
            }else{
                return this.slice(0,index).concat(this.slice(index+1,this.length));
            }
        }
    })();


    var Util = {};

    /**
     * 产生min到max的随机整数
     * @param min 最小值
     * @param max 最大值
     * @returns {Number} 随机整数
     */
    Util.randomInt = function(min,max){
        return parseInt(min+Math.random()*(max-min));
    };

    /**
     * 产生min到max的随机浮点数
     * @param min 最小值
     * @param max 最大值
     * @returns {Number} 随机浮点数
     */
    Util.randomFloat = function(min,max){
        return min+Math.random()*(max-min);
    };

    /**
     * 产生前缀为prefix长度为length+prefix.length的随机字符串
     * @param prefix 随机字符串 默认为空
     * @param length 随机字符串 默认长度32
     * @returns {string} 随机字符串
     */
    Util.randomString = function(prefix,length){
        if(!prefix) prefix = "";
        if(!length || length<0) length = 32;
        var _dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var _dict_length = _dict.length;
        var rdStr = "";
        for(var i=0;i<length;i++){
            rdStr += _dict[Util.randomInt(0,_dict_length-1)];
        }
        return prefix+rdStr;
    };
    module.exports = Util;
});

