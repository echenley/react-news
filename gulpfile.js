'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');

var $ = require('gulp-load-plugins')();

var srcDir = './src/';
var buildDir = './build/';
var distDir = './dist/';
var mapsDir = './maps/';

var jsEntry = 'app';
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

function buildScript(file) {
    var props = watchify.args;
    props.entries = [srcDir + 'js/' + file];
    props.debug = true;
    props.extensions = ['.js', '.jsx'];

    var bundler = watchify(browserify(props), {
            ignoreWatch: true
        })
        .transform(babelify.configure({
            only: /(src\/js)/
        })
    );

    function rebundle() {
        $.util.log('Rebundle...');
        var start = Date.now();
        return bundler.bundle()
            .on('error', handleError)
            .pipe(source(jsEntry + '.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.sourcemaps.write(mapsDir))
            .pipe(gulp.dest(buildDir))
            .pipe($.notify(function() {
                console.log('Rebundle Complete [' + (Date.now() - start) + 'ms]');
            }));
    }

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('styles', function() {
    return gulp.src(sassEntry)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true,
            // compression handled in dist task
            style: 'expanded'
        }))
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

gulp.task('build', ['html', 'styles'], function() {
    return buildScript(jsEntry + '.jsx');
});

gulp.task('dist', function() {
    runSequence(
        'clean',
        'build',
        'minify'
    );
});

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: buildDir
        }
    });

    gulp.watch(srcDir + '*.html', ['html']);
    gulp.watch(srcDir + 'js/**/*.js', ['lint']);
    gulp.watch(srcDir + 'scss/**/*.scss', ['styles']);

    $.watch([
        buildDir + '**/*.js',
        buildDir + '**/*.html'
    ], browserSync.reload);
});

gulp.task('default', ['serve']);
