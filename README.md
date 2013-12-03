webT
====

A node connect base web template

### Install  

```
npm install webt -g
```

### Usage  

```
$ webt 

#or

$ webt target_path
```

### Plugins  
webT support some plugins to cater to different needs.  

* `mysql`: Init `common/mysql.js` and corresponding configuration items. Use [easymysql](https://github.com/aleafs/easymysql).  
* `redis`: Init `common/redis.js` and corresponding coniguration items, also use redis to store the sessions. Use [mredis](https://github.com/dead-horse/multi_redis) and [connect-mredis](https://github.com/dead-horse/connect-mredis).
* `logger`: Init `common/logger.js` and corresponding configuration, also use this logger module to log some error in project. All the log files will split by day.This plugin will import 4 modules: `moment`, `ms`, `mkdirp` and `logfilestream`.
* `socketIo`: Init a simple `socket.io` example with the connect. 
* `restfulWrap`: Init a wraper for rest json api. Also init an example to show how to use this wraper. This plugins use [restful-wrap](https://github.com/fengmk2/restful-wrap) to do restful controllers wrap, use [parameter](https://github.com/fengmk2/parameter) to do params check, use [var-style](https://github.com/dead-horse/var-style) to transform the inputs and outputs.

### Example  
This is an [example](https://github.com/dead-horse/holy_shit) web generate by webT.  

### Authors  

```
$ git summary 

 project  : webT
 repo age : 4 days ago
 commits  : 19
 active   : 4 days
 files    : 33
 authors  : 
    18  dead-horse              94.7%
     1  dead_horse              5.3%
```

### License  
MIT
