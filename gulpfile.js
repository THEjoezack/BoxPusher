// Gulp Dependencies
var gulp = require('gulp');

// Build Dependencies
var browserify = require('browserify');
var bower = require('gulp-bower');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var through2 = require('through2');

// Development Dependencies
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');

// Test Dependencies
var mocha = require('gulp-mocha');
var util = require('gulp-util');

// Publish Dependencies
var clean = require('gulp-clean');

// Tasks
gulp.task('lint-client', function() {
  return gulp.src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
  return gulp.src('./test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./bower_components'))
});

gulp.task('test', ['lint-client', 'lint-test'], function() {
  return gulp.src('./test/**/*.js')
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', util.log);
});

gulp.task('clean', function(){
  return gulp.src(['./public', './build'], {read:false})
    .pipe(clean());
});

gulp.task('publish',['bundle'], function(){
  gulp.src(['./client/**/*.html', './bower_components/**/*', './build/**/*'])
    .pipe(gulp.dest('./public'));
});

gulp.task('bundle', ['clean'], function () {
  return gulp.src('./client/**/*.js')
      .pipe(through2.obj(function (file, enc, next){
        browserify(file.path)
            .bundle(function(err, res){
              // assumes file.contents is a Buffer
              file.contents = res;
              next(null, file);
            });
      }))
      .pipe(gulp.dest('./build/'))
});

gulp.task('dev', ['publish'], function() {
    connect.server({
        root: 'public',
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['client/**'], ['publish']);
});