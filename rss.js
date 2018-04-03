var request         = require("superagent"),
    charsetCompoent = require('superagent-charset'),
    superagent      = charsetCompoent(request),
    eventproxy      = require("eventproxy"),
    feedparser      = require("feedparser"),
    iconv           = require("iconv-lite"),
    fs              = require("fs");

var ep = new eventproxy(),
    count = 0;

class service {
    constructor() {
        this.result = [];
    }

    getData(valueList, callback) {
        var $self = this;
        valueList.forEach(function(value, idx) {
            var fp              = new feedparser(),
                category        = {
                    "category": value.name,
                    "data": []
                }
            superagent.get(value.url)
                .charset('gb2312')
                .type("xml")
                .on("error", function (err) {
                    console.log("===== %s 获取数据失败 =====",value.name)
                    console.log(err);
                })
                //.pipe(iconv.decodeStream("gb2312"))
                //.pipe(iconv.encodeStream("utf-8"))
                .pipe(iconv.decodeStream("utf-8"))
                .pipe(fp)
                .on("error", function (err) {
                    console.log("===== %s 解析数据失败 =====",value.name);
                    console.error(err);
                })
                .on("readable", function () {
                    var $stream = this,
                        obj = null,
                        item

                    while(item = $stream.read()) {
                        obj = {
                            "title" : item.title,
                            "link" : item.link
                        }
                    }

                    ++count;
                    category.data.push(obj);
                })
                .on("end", function (err) {
                    if(err) {
                        console.log(">>>>>> 出现错误!!!");
                        console.log(err);
                    } else {
                        $self.result.push(category);
                        //console.log("===== %s 已解析完数据 =====",value.name);
                        ep.emit("get_data");
                    }
                })
        })

        ep.after("get_data", valueList.length, function () {
            //console.log("所有结果：%s 组 共 %s 条",$self.result.length,count);
            callback && callback($self);
        })
    }

    saveData(callback) {
        var $self = this;
        var ep = eventproxy();
        for(var i = 0; i<$self.result.length; i++) {
            for(var j = 0; j < 5; j++){
                console.log($self.result[i].data[j].title,$self.result[i].data[j].link);
            }
        }

        /*ep.after("save_Data", $self.result.length , function () {
            db.close();
        })*/

        callback && callback();
    }
}

module.exports = new service;