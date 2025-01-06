const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif')
const webp = require('gulp-webp');
const newer = require('gulp-newer');
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const flatten = require('gulp-flatten');

// НАСТРОЙКА БИЛДА - Srart
const gulp = require('gulp');
const path = require('path');
const htmlreplace = require('gulp-html-replace');
const replace = require('gulp-replace');

// Очищаем папку build перед копированием файлов

gulp.task('clean', () => {
    return gulp.src('build', { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
});

// копируем папки images, css, js без изменений, html из корня, пропускаем папку html
gulp.task('copy', () => {
    return gulp.src(['app/images/**/*', 'app/css/**/*', 'app/js/**/*', 'app/*.html', '!app/html/**/*'], {
        base:
            'app'
    })  // Исключаем папку html
        .pipe(gulp.dest('build'));
});

//  Заменяем .html в атрибутах href на ""
gulp.task('html', () => {
    return gulp.src('app/**/*.html')
        .pipe(replace('.html"', '"'))
        .pipe(htmlreplace({
            'removeHtmlExtension': {
                src: '',
                tpl: '<link rel="stylesheet" href="%s.css"><script src"%s.js"></script>'
            }
        }))
        .pipe(gulp.dest('build'));
});

// Задача для удаления папки html из build
gulp.task('cleanHtmlFromBuild', () => {
    return gulp.src('build/html', { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
});

// Запускаем задачи по очистке, копированию файлов и оброботке html
gulp.task('build', gulp.series('clean', 'copy', 'html', 'cleanHtmlFromBuild'));

// Задача по умолчанию
gulp.task('defaul', gulp.series('build'));

// НАСТРОЙКА БИЛДА - end


function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/swiper/swiper-bundle.js',
        'node_modules/mixitup/dist/mixitup.min.js',
        'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
        'app/js/**/*.js',
        '!app/js/main.min.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/html/**/*.html'], htmlInclude);
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

const htmlInclude = () => {
    return src(['app/html/page/*.html'])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file',
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream());
}

exports.htmlInclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(htmlInclude, styles, browsersync, scripts, watching);

