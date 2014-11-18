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
var onError = function (err) {  
  $.util.beep();
  $.util.log(err);
};

// Styles
gulp.task('styles', function () {
    return gulp.src(['app/bower_components/normalize.css/normalize.css',
                     'app/styles/main.scss'])
        .pipe($.plumber({
          errorHandler: onError
        }))
        .pipe($.concat('main.scss'))
        .pipe($.rubySass({
            style: 'compressed',
            precision: 10,
            loadPath: ['app/bower_components']
        }))
        .pipe($.autoprefixer('last 3 versions'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

// Scripts

gulp.task('scripts', function () {
    var b = browserify({
        entries: ['./app/scripts/app.jsx'],
        transform: [reactify],
        extensions: ['.jsx'],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    });

    var watcher = watchify(b);

    return watcher
        .on('error', function (err) {
            $.util.beep();
            $.util.log(err);
            this.emit('end');
        })
        .on('update', function () { // When any files update
            var updateStart = Date.now();
            $.util.log('Updating!');
            // Create new bundle that uses the cache for high performance
            watcher.bundle()
                .pipe($.plumber({
                  errorHandler: onError
                }))
                .pipe(source('app.js'))
                .pipe($.streamify($.uglify()))
                .pipe(gulp.dest('./dist/scripts'));

            $.util.log('Updated!', (Date.now() - updateStart) + 'ms');
        })
        .bundle()
        .pipe($.plumber({
          errorHandler: onError
        }))
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist/scripts'));
});

// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
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
    return gulp.src('app/scripts/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});

// Clean
gulp.task('clean', function (cb) {
    del(['dist/styles', 'dist/scripts', 'dist/images'], cb);
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function(){
    return gulp.src('./app/*.html')
        .pipe($.plumber({
          errorHandler: onError
        }))
       .pipe($.useref.assets())
       .pipe($.useref.restore())
       .pipe($.useref())
       .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean', 'build', 'jest' ]);

// Webserver
gulp.task('serve', function () {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000,
            fallback: 'index.html'
        }));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src(['app/bower_components/**/*.js', 'app/bower_components/**/*.scss'], {base: 'app/bower_components'})
        .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
        .pipe(gulp.dest('dist/scripts/'));
});

// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/images/**/*', ['images']);
});
