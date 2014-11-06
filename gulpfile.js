'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var browserify = require('browserify');
var reactify = require('reactify');
var transform = require('vinyl-transform');
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
    var browserified = transform(function (filename) {
        var b = browserify({
            entries: [filename],
            extensions: ['.jsx'],
            debug: true
        });
        b.transform(reactify);
        return b.bundle()
            .on('error', function (err) {
                $.util.beep();
                $.util.log(err);
                this.emit('end');
            });
    });

    return gulp.src('app/scripts/app.jsx')
        .pipe($.plumber({
          errorHandler: onError
        }))
        .pipe(browserified)
        // .pipe($.uglify())
        .pipe($.rename('app.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size());
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
    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);
    // Watch .html files
    gulp.watch('app/*.html', ['html']);
    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch(['app/scripts/**/*.js', 'app/scripts/**/*.jsx'], ['scripts', 'jest' ]);
    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});
