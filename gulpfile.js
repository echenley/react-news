'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
// Load plugins
var $ = require('gulp-load-plugins')();

// gulp-plumber for error handling
function onError () {
    /* jshint ignore:start */
    var args = Array.prototype.slice.call(arguments);
    $.util.beep();
    $.notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
    /* jshint ignore:end */
}


// Styles
gulp.task('styles', function () {
    return gulp.src([
            'src/bower_components/normalize.css/normalize.css',
            'node_modules/react-spinner/react-spinner.css',
            'src/styles/main.scss'
        ])
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.concat('main.scss'))
        .pipe($.rubySass({
            style: 'compressed',
            precision: 10,
            loadPath: ['src/bower_components']
        }))
        .pipe($.autoprefixer('last 3 versions'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});


// Scripts
gulp.task('scripts', function () {
    var bundler;
    bundler = browserify({
        basedir: __dirname,
        entries: ['./src/scripts/app.jsx'],
        transform: [reactify],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    bundler = watchify(bundler);

    function rebundle () {
        console.log('Bundling Scripts...');
        var start = Date.now();
        return bundler.bundle()
            .on('error', onError)
            .pipe(source('app.js'))
            .pipe(gulp.dest('dist/scripts'))
            .pipe($.notify(function () {
                console.log('Bundling Complete - ' + (Date.now() - start) + 'ms');
            }));
    }

    bundler.on('update', rebundle);

    return rebundle();
});


// HTML
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});


// Images
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});


// Testing
gulp.task('jest', function () {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('src/scripts/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});


// Clean
gulp.task('clean', function (cb) {
    del(['dist/styles', 'dist/scripts', 'dist/images'], cb);
});


// Build
gulp.task('build', ['html', 'styles', 'scripts', 'images'], function () {
    return gulp.src('dist/scripts/app.js')
        .pipe($.rename('app.min.js'))
        .pipe($.streamify($.uglify()))
        .pipe(gulp.dest('dist/scripts'));
});


// Default task
gulp.task('default', ['clean', 'build', 'jest']);


// Webserver
gulp.task('serve', function () {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000,
            fallback: 'index.html'
        }));
});


// Watch
gulp.task('watch', ['html', 'styles', 'scripts', 'serve'], function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/images/**/*', ['images']);
});
