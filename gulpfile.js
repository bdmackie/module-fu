var gulp = require('gulp');
var mocha = require('gulp-mocha');
var validate = require('gulp-nice-package');

gulp.task('test', [], function () {
    gulp.src('test/**/test*.js', {read: false})
        .pipe(mocha({reporter: 'spec', recursive: true}));
});

gulp.task('validate-json', function () {
  return gulp.src('package.json')
    .pipe(validate());
});