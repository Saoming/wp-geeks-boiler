const { src, dest, watch, series} = require('gulp');
const postCss = require('gulp-postcss');
const stripCssComments = require('gulp-strip-css-comments');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const notify = require("gulp-notify");
const browserSync = require('browser-sync').create();

// WP write header and footer
const fs = require('fs');
const header = require('gulp-header');
const footer = require('gulp-footer');

// Package.JSON contents
const pkg = JSON.parse(fs.readFileSync('./package.json'))

// Tailwind, Stlying CSS Tasks, WordPress Style
function cssTask() {
  const cssbanner = [
    '/*',
    'Theme Name:          ' + pkg.themename,
    'Description:         ' + pkg.description,
    'Author:              ' + pkg.author,
    'Author URI:          ' + pkg.authoruri,
    'Version:             ' + pkg.version,
    'Theme URI:           ' + pkg.homepage,
    'License:             ' + pkg.license,
    'License URI:         ' + pkg.licenseuri,
    'Text Domain:         ' + pkg.textDomain,
    '*/',
    ''
  ].join('\n')

  return src('./src/css/style.css', { sourcemaps: true })
    .pipe(postCss([
      require('postcss-import'),
      require('tailwindcss'),
      require('autoprefixer')
    ]))
    .pipe(stripCssComments({ preserve: false }))
    .pipe(cleanCSS(require('./configs/clean-css.js')))
    .pipe(
      header(cssbanner, {
        pkg: pkg
      })
    )
    .pipe(footer('\n'))
    .on('error', console.error.bind(console))
    .pipe(dest('./'))
    .pipe(notify({ message: 'CSS task complete'}));
}

// Javascript Tasks
function jsTask(){
  return src('src/js/script.js', {sourcemaps: true})
    .pipe(terser())
    .pipe(dest('dist', {sourcemaps: '.'}))
    .pipe(notify({ message: 'Javascript task complete'}));
}

// BrowserSync Functions
function browserSyncServe(cb){
  browserSync.init({
    proxy: 'http://localhost/staging/',
    notify: true
  });
  cb();
}

function browserSyncReload(cb){
  browserSync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('./**/*.php', browserSyncReload);
  watch(['./src/css/**/*.css', './src/js/**/*.js'], series(cssTask, jsTask, browserSyncReload));
}

// default gulp tasks
exports.default = series(
  cssTask,
  jsTask,
  browserSyncServe,
  watchTask
);