var gulp=require('gulp');
var htmlmin=require('gulp-htmlmin');
var exReplace=require('gulp-ex-replace');
var concatCss=require('gulp-concat-css');
var cleanCss=require('gulp-clean-css');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var imagemin=require('gulp-imagemin');
// babel
var babel = require("gulp-babel");
// cht
var cht=require('gulp-cht');

//var objDate=new Date();
//var v='?v=1.'+(objDate.getMonth()+1)+'.'+objDate.getDate()+objDate.getMilliseconds();
var v='?v=15.9.2';


gulp.task('html',function(){
  return gulp.src('index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/'));
});

gulp.task('css',function(){
  return gulp.src(['css/reset.css','css/grid_fee300.css','css/swiper.css','css/styles.css','tangram/css/master.min.css'])
    .pipe(concatCss("fangxuecong.css"))
    .pipe(cleanCss({compatibility:'ie8'}))
    .pipe(gulp.dest('online/'));
});

gulp.task('js',function(){
  return gulp.src(['js/modernizr.js','js/FSS.js','js/jquery-3.0.0.min.js','js/wave.js','js/theater.min.js','js/swiper.jquery.min.js','js/main.js'])
    .pipe(concat('fangxuecong.js'))
    .pipe(uglify())
    .pipe(gulp.dest('online/'));
});

gulp.task('img',function(){
  return gulp.src('img/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./online/img/'));
});

gulp.task('fifteen',function(){
  return gulp.src('fifteen/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="\.\.\/js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="../fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="../fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/fifteen/'));
});
gulp.task('tangram',function(){
  return gulp.src('tangram/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="\.\.\/js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="../fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="../fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/tangram/'));
});
gulp.task('tetrishtml',function(){
  return gulp.src('tetris-game/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="tetris-game.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="tetris-game.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/tetris-game/'));
});
gulp.task('tetriscss',function(){
  return gulp.src(['css/reset.css','tetris-game/css/styles.css'])
    .pipe(concatCss("tetris-game.css"))
    .pipe(cleanCss({compatibility:'ie8'}))
    .pipe(gulp.dest('online/tetris-game/'));
});
gulp.task('tetrisjs',function(){
  return gulp.src(['tetris-game/js/main.js'])
    .pipe(concat('tetris-game.js'))
    .pipe(uglify())
    .pipe(gulp.dest('online/tetris-game/'));
});
gulp.task('tetrisimg',function(){
  return gulp.src('tetris-game/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./online/tetris-game/img/'));
});
gulp.task('tetrisfont',function(){
  return gulp.src('tetris-game/css/MISTRAL.TTF')
    .pipe(gulp.dest('./online/tetris-game/css/'));
});
gulp.task('rememberhtml',function(){
  return gulp.src('remember/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src=".+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="../fangxuecong.css'+v+'" /><link rel="stylesheet" href="remember.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="https://cdn.bootcss.com/react/15.6.1/react.min.js"></script><script src="https://cdn.bootcss.com/react/15.6.1/react-dom.min.js"></script><script src="remember.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/remember/'));
});
gulp.task('remembercss',function(){
  return gulp.src(['remember/css/checkbox.css','remember/css/styles.css'])
    .pipe(concatCss("remember.css"))
    .pipe(cleanCss({compatibility:'ie8'}))
    .pipe(gulp.dest('online/remember/'));
});
gulp.task("rememberbabel", function () {
  return gulp.src("remember/js/remember.js")
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("online/remember/"));
});
gulp.task('bst',function(){
  return gulp.src('bst/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="\.\.\/js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="../fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="../fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/bst/'));
});
gulp.task('f',function(){
  return gulp.src('f/*')
    .pipe(gulp.dest('online/f/'));
});
gulp.task('map',function(){
  return gulp.src('map.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/'));
});
gulp.task('getintouch',function(){
  return gulp.src('getintouch/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="\.\.\/js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="../fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="../fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/getintouch/'));
});
gulp.task('php',function(){
  return gulp.src(['./**/*.php','!f/**/*.php','!online_public_html/**/*.php','!test/**/*.php'])
    .pipe(exReplace(/Li\('localhost','root',''/g,'Li(\'localhost\',\'fangxuec_root\',\'p0\''))
    .pipe(gulp.dest('online/'));
});
gulp.task('cdc',function(){
  return gulp.src('cdc/index.html')
    .pipe(exReplace(/<link rel="stylesheet".+?\/>/g,''))
    .pipe(exReplace(/<script src="\.\.\/js\/.+?"><\/script>/g,''))
    .pipe(exReplace(/<\/head>/g,'<link rel="stylesheet" href="../fangxuecong.css'+v+'" /></head>'))
    .pipe(exReplace(/<\/body>/g,'<script src="../fangxuecong.js'+v+'"></script></body>'))
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('online/cdc/'));
});
gulp.task("cdcjs", function () {
  return gulp.src("cdc/wuziqi.js")
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest("online/cdc/"));
});


gulp.task('basetask',['html','css','js','img','fifteen','tangram','tetrishtml','tetriscss','tetrisjs','tetrisimg','tetrisfont','rememberhtml','remembercss','rememberbabel','bst','f','map','getintouch','php','cdc','cdcjs'],function(){
  console.log('-----base task okay, nextstep, 2.run gulp zhhk-----');
});
//zhhk, after basetask
gulp.task('onlineimgfont',function(){
  return gulp.src(['online/img/**/*','online/tetris-game/img/**/*','online/**/*.TTF'],{base:'online'})
    .pipe(gulp.dest('./online/zh-HK/'));
});
gulp.task('onlinecssjhenghei',function(){
  return gulp.src(['online/**/*.css'])
    .pipe(exReplace(/font-family:"微软雅黑",Ubuntu,Arial,"libra sans",sans-serif/g,'font-family: "Microsoft JhengHei","微軟正黑體",PMingLiU,Arial,sans-serif'))
    .pipe(gulp.dest('./online/zh-HK/'));
});
gulp.task('onlinehtmljsphp',function(){
  return gulp.src(['online/**/*.html','online/**/*.js','online/**/*.php','!online/fangxuecong.js','!online/index.html','!online/map.html'])
    .pipe(cht())
    .pipe(gulp.dest('./online/zh-HK/'));
});
gulp.task('onlinejshi',function(){
  return gulp.src(['online/fangxuecong.js'])
    .pipe(exReplace(/大家好，我是学聪/g,'Hi，各位！我系Thilina'))
    .pipe(exReplace(/现居住在深圳/g,'依家住係深圳'))
    .pipe(exReplace(/我努力做出好看的/g,'我努力做出好睇噶'))
    .pipe(cht())
    .pipe(gulp.dest('./online/zh-HK/'));
});
gulp.task('onlinehtmlzh',function(){
  return gulp.src(['online/index.html','online/map.html'])
    .pipe(cht())
    .pipe(exReplace(/<a href="\/zh-HK\/">&nbsp;繁體中文（zh-HK）<\/a>/g,'<a class="yh-font" href="/">&nbsp;简体中文（zh-CN）</a>'))
    .pipe(gulp.dest('./online/zh-HK/'));
});
gulp.task('zhhk',['onlineimgfont','onlinecssjhenghei','onlinehtmljsphp','onlinejshi','onlinehtmlzh'],function(){
  console.log('-----zh hk okay-----');
});

//build  1.basetask 2.zhhk
//=============================================================================================================================================default
/*
gulp.task('default',['html','css','js','img','fifteen','tangram','tetrishtml','tetriscss','tetrisjs','tetrisimg','tetrisfont','rememberhtml','remembercss','rememberbabel','bst','f','map','getintouch','php'],function(){ //,'img','tetrisimg'
  //将你的默认的任务代码放在这
  console.log("--------------okay----------------------");
});
*/
gulp.task('default',function(){
  console.log('-----http://gulpjs.com/-----');
  console.log('-----1.run gulp basetask-----');
  console.log('-----2.run gulp zhhk-----');
});
