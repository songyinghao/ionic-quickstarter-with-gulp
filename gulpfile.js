var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var del = require('del');
var gulpCopy = require('gulp-copy');
var watch = require('gulp-watch');
/**
 * Linting Sass stylesheets with Stylelint
 * http://www.creativenightly.com/2016/02/How-to-lint-your-css-with-stylelint/
 */
var postcss     = require('gulp-postcss');
var reporter    = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint   = require('stylelint');

var ngConstant = require('gulp-ng-constant');
var extend = require('gulp-extend');
var args    = require('yargs').argv;

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');

var imagemin = require('gulp-imagemin');

//
// === PATHS ===
//
var paths = {
  sass: ['./src/css/scss/*.scss'],
  templates: ['./src/app/**/*.html'],
  images: ['./src/app/**/img/*'],
  commonimages: ['./src/img/*'],
  dist: ['./www']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./src/css/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./src/css/'))
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

// scss lint
gulp.task("scss-lint", function() {

  // stylelint config rules
  var stylelintConfig = {
    "extends": "stylelint-config-standard",
    "rules": {
      "indentation": [ 2, {
        "warn": true,
        "except": ["param"],
        "message": "Please use 2 spaces for indentation. Tabs make The Architect grumpy."
      } ],
      "number-leading-zero": null,
    }
  }

  var processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true,
    })
  ];

  return gulp.src(['./src/css/scss/*.scss'])
    .pipe(postcss(processors), {syntax: syntax_scss});
});

// api config
var config = function(env) {
  gulp.src(['./src/app/config/config.default.json', 'src/app/config/config.' + env + '.json'])
    .pipe(extend('config.json', true))
    .pipe(ngConstant({
      name: 'starter.configs',
      deps: [],
    }))
    .pipe(rename(function(path) {
      path.basename = 'config';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('src/app/config'));
};

gulp.task('set-api-config', function() {
  config(args.env || "development")
})

// templatesCache task
gulp.task('templates', function() {
  gulp.src(paths.templates)
    .pipe(minifyHtml({empty: true}))
    .pipe(templateCache({
      standalone: true,
      root: 'app'
    }))
    .pipe(gulp.dest(paths.dist + '/js'));
});

// imagemin images and output them in dist
gulp.task('imagemin', function() {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + '/app'));
});

gulp.task('common-imagemin', function() {
  gulp.src(paths.commonimages)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + '/img'));
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
