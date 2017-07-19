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

var objDate=new Date();
var v='?v=1.'+(objDate.getMonth()+1)+'.'+objDate.getDate()+objDate.getMilliseconds();
// var v='';


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


gulp.task('onlineimg',['img','tetrisimg'],function(){
  console.log('------------onlineimg----------------');
  return gulp.src(['online/img/**/*','online/tetris-game/img/**/*'],{base:'online'})
    .pipe(gulp.dest('./online/zh-HK/'));
});
gulp.task('tocht',['html','css','js','fifteen','tangram','tetrishtml','tetriscss','tetrisjs','tetrisfont','rememberhtml','remembercss','rememberbabel','bst','f','map','getintouch','php'],function(){
//gulp.task('tocht',['html'],function(){
  console.log("--------------cht---------------------");

  //gulp.src(['online/**/*','!online/zh-HK/**/*','!online/img/**/*','!online/tetris-game/img/**/*','!online/zh-HK','!online/img/','!online/tetris-game/img/'])
  //    .pipe(cht())
  //    .pipe(gulp.dest('./online/zh-HK/'));
});

//============default
gulp.task('default',['html','css','js','img','fifteen','tangram','tetrishtml','tetriscss','tetrisjs','tetrisimg','tetrisfont','rememberhtml','remembercss','rememberbabel','bst','f','map','getintouch','php'],function(){ //,'img','tetrisimg'
  //将你的默认的任务代码放在这
  console.log("--------------okay----------------------");
});
