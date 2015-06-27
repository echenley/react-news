'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var modRewrite = require('connect-modrewrite');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var extend = require('lodash/object/extend');

var $ = require('gulp-load-plugins')();

var srcDir = './src/';
var buildDir = './build/';
var distDir = './dist/';
var mapsDir = './maps/';

var jsEntry = 'App';
var sassEntry = srcDir + 'scss/*.scss';

function handleError() {
    $.util.beep();
    $.notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, arguments);

    // Keep gulp from hanging on this task
    this.emit('end');
}

gulp.task('lint', function() {
    return gulp.src(srcDir + 'js/**/*')
        .pipe($.eslint({
            useEsLintrc: true
        }))
        .pipe($.eslint.format());
});

function buildScript(file, watch) {
    var props = extend({}, watchify.args, {
        entries: [srcDir + 'js/' + file],
        debug: true,
        extensions: ['.js', '.jsx']
    });

    var bblfy = babelify.configure({
        only: /(src\/js)/
    });

    var brwsfy = browserify(props).transform(bblfy);

    var bundler = watch ? watchify(brwsfy, {
        ignoreWatch: true
    }) : brwsfy;

    function rebundle() {
        return bundler.bundle()
            .on('error', handleError)
            .pipe(source(jsEntry.toLowerCase() + '.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.sourcemaps.write(mapsDir))
            .pipe(gulp.dest(buildDir));
    }

    bundler.on('update', rebundle);
    bundler.on('log', $.util.log);
    bundler.on('error', $.util.log);
    return rebundle();
}

gulp.task('styles', function() {
    gulp.src(sassEntry)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            // compression handled in dist task
            outputStyle: 'expanded',
            errLogToConsole: true
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer('last 2 versions'))
        .pipe($.sourcemaps.write(mapsDir))
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream({ match: '**/*.css' }))
        .pipe($.size());
});

gulp.task('html', function() {
    return gulp.src(srcDir + '*.html')
        .pipe(gulp.dest(buildDir))
        .pipe($.size());
});

gulp.task('minify', function() {
    var assets = $.useref.assets();

    // minify css/js and move index.html to /dist
    return gulp.src('build/*.html')
        .pipe($.plumber())
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(distDir))
        .pipe($.size())
        .pipe($.exit());
});

gulp.task('clean', function(cb) {
    del([
        buildDir,
        distDir
    ], cb);
});

gulp.task('build-watch', ['html', 'styles'], function() {
    return buildScript(jsEntry + '.jsx', true);
});

gulp.task('build', ['html', 'styles'], function() {
    return buildScript(jsEntry + '.jsx', false);
});

gulp.task('dist', function() {
    runSequence(
        'clean',
        'build',
        'minify'
    );
});

gulp.task('watch', ['build-watch'], function() {
    browserSync.init({
        server: {
            baseDir: buildDir,
            middleware: [
                modRewrite([
                    '!\\.\\w+$ /index.html [L]'
                ])
            ]
        }
    });

    gulp.watch(srcDir + '*.html', ['html']);
    gulp.watch(srcDir + 'js/**/*', ['lint']);
    gulp.watch(srcDir + 'scss/**/*.scss', ['styles']);

    $.watch([
        buildDir + '**/*.js',
        buildDir + '**/*.html'
    ], browserSync.reload);
});

gulp.task('serve', function(cb) {
    runSequence(
        'clean',
        'watch',
        cb
    );
});

gulp.task('default', ['serve']);
