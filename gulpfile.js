var gulp = require('gulp-param')(require('gulp'), process.argv);
var mocha = require('gulp-mocha');
var validate = require('gulp-nice-package');
var git = require('gulp-git');
var bump = require('gulp-bump');
var runSequence = require('run-sequence');

gulp.task('test', [], function () {
    gulp.src('test/**/test*.js', {read: false})
        .pipe(mocha({reporter: 'spec', recursive: true}));
});

gulp.task('validate-json', function () {
  return gulp.src('package.json')
    .pipe(validate());
});


gulp.task('add', function (m) {
	return gulp.src('.')
		.pipe(git.add({args: '--all'}));
});

gulp.task('commit', function (m) {
	if (!m)
		m = 'bumped version';
	return gulp.src('.')
		.pipe(git.commit(m, {args: '-a'}));
});

gulp.task('push', function (cb) {
	git.push('origin', 'master', cb);
});

gulp.task('push-all', function (callback) {
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
      callback(error);
    });
});

gulp.task('bump', function(){
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
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