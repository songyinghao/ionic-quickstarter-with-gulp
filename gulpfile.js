var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var del = require('del');

//
// === PATHS ===
//
var paths = {
  sass: ['./scss/**/*.scss'],
  dist: ['./www']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

//
// === CHILD TASKS ===
//

// clean task
gulp.task('clean', function (cb) {
  return del([
    paths.dist + '/**/*'
  ], cb);
});

// copy all files under the SRC to the WWW directory
gulp.task('copy-src-to-dest', function() {
  gulp.src(['./src/**/*','./src/index.html'])
    .pipe(gulp.dest('./www'));
});

// watch SRC folder
gulp.task('watch-src-folder', function() {
  gulp.src(['./src/*','./src/**/*'], {base: './src'})
    .pipe(watch('./src', {base: './src'}))
    .pipe(gulp.dest('./www'));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
