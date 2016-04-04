## Api Bus
这是一个配合openresty完成的一个工具库，它包含了一个客户端脚本和一个服务端脚本程序。之所以给他命名为Api Bus，是因为它可以合并多个ajax请求到一个请求中，使api们就像是坐上了同一目的地的Bus，一起出发、一起到达。减少了页面连接数，并且得益于openresty的capture_multi子请求的特性，以达到多个请求只取最长响应时间为整体响应时间的特点，大幅提升页面加载速度。

## 快速开始
首先你需要一台安装了openresty的服务器（按照官网安装步骤很简单），将apibus.lua文件拷贝至项目的目录下，配置nginx中apibus的路由地址：
```
location /apis/apibus {
    default_type "application/json; charset=utf-8";
    content_by_lua_file apis/apibus.lua;
}
```

在页面中添加jQuery依赖，并引入apibus客户端
```html
<script src="//cdn.bootcss.com/jquery/1.12.0/jquery.min.js"></script>
<script src="/assets/lib/apibus.js"></script>
```

开始使用，将多个ajax请求加入到apibus队列中
```javascript
apiBus.add([{
        url:'/apis/one', 
        success: function(result){
            console.log('one api success!')
            console.log(result);
        },
        complete: function(result){
            console.log('one api complete!')
        }
    }, {
        
        url:'/apis/two',
        params: {arg: 'params?'},
        success: function(result){
            console.log('two api success!')
            console.log(result);
        }
    }
]);

apiBus.add({
    url:'/apis/three', 
    error: function(result){
        console.log('three api error!')
        console.log(result);
    }
});

apiBus.add({
    url:'/apis/four', 
    method: 'POST',
    body: {d: 'ddd?'},
    success: function(result){
        console.log(result.data);
    }
});

apiBus.start(function(){
    console.log('api bus done!');
});
```

# License

  MIT