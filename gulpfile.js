var gulp = require('gulp');
var mocha = require('gulp-mocha');
var validate = require('gulp-nice-package');
var git = require('gulp-git');
var bump = require('gulp-bump');
var runSequence = require('run-sequence');
var fs = require('fs');

var minimist = require('minimist');
var options = minimist(process.argv.slice(2));

gulp.task('test', [], function () {
    gulp.src('test/**/test*.js', {read: false})
        .pipe(mocha({reporter: 'spec', recursive: true}));
});

gulp.task('validate-json', function () {
  return gulp.src('package.json')
    .pipe(validate());
});

/*
gulp.task('add', function () {
	return gulp.src('.')
		.pipe(git.add({args: '--all'}));
});

gulp.task('commit', function () {
	var m = options.m ? options.m : 'bumped version';
	return gulp.src('.')
		.pipe(git.commit(m, {args: '-a'}));
});

gulp.task('push-all', function (cb) {
  runSequence(
    'add',
    'commit',
    'push',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      cb(error);
    });
});
*/

gulp.task('commit-version', function () {
	var m = options.m ? options.m : 'bumped version';
	return gulp.src('.')
		.pipe(git.commit(m, {args: '-a'}));
});

gulp.task('bump', function(){
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('push', function (cb) {
	git.push('origin', 'master', cb);
});

gulp.task('bump-push', function (cb) {
  runSequence(
    'bump',
    'commit-version',
    'push',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      cb(error);
    });
});

gulp.task('tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion () {
    //We parse the json file instead of using require because require caches multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});