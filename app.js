var fs              = require("fs"),
    service         = require("./rss.js")

var DataPort = [
    {
        name: "百度FEX团队",
        category:"FEX 技术周刊",
        url:"http://fex.baidu.com/feed.xml"
    },
    {
        name: "淘宝前端团队",
        category:"淘宝前端团队",
        url:"http://taobaofed.org/atom.xml"
    },
    {
        name: "腾讯alloyteam",
        category:"腾讯alloyteam",
        url:"http://www.alloyteam.com/feed/"
    }
];


service
    .getData(DataPort,function ($self) {
        console.log("\n===== 接收阶段结束， 准备存储数据 =====");

        $self.saveData(function () {
            console.log("\n===== 存储数据结束 =====");
        });
    })