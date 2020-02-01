const { src, dest, parallel, watch, series } = require('gulp');

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const livereload = require('gulp-livereload');
const minify = require('gulp-minify');
const autoprefixer = require('gulp-autoprefixer');
const concatCss = require('gulp-concat-css');
const concat = require('gulp-concat');

function html() {
  return src('app/*.html')
    .pipe(pug())
    .pipe(htmlmin({ removeComments: true,collapseWhitespace: true }))
    .pipe(dest('build/'));
}

function css() {
  return src('app/sass/*.sass')
    .pipe(sass())
    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({cascade: false}))
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
  }

function js() {
  return src('app/js/*.js')
    .pipe(concat('index.js'))
    .pipe(minify())
    .pipe(dest('build/js'))
}

function startHost() {
  browserSync.init({
    server: {
      baseDir: './build',
      notify: false
    }
  })
};

function reload(done){
  browserSync.reload();

  done();
}

watch( 'app/sass/*.sass', series(css, reload) );

watch( 'app/*.html', series(html, reload) );

watch( 'app/js/*.js', series(js, reload) );

exports.css = css;
exports.html = html;
exports.js = js;
exports.default = parallel(html, css, js, startHost);