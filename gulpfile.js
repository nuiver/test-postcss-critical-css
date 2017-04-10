var gulp = require('gulp');
var clean  = require('gulp-clean');
var sass = require('gulp-sass');

gulp.task('clean-styles', function () {
  return gulp.src(['assets/css'], {read: false})
    .pipe(clean());
});

gulp.task('sass', ['clean-styles'], function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css/'));
});

gulp.task('styles', ['sass'], function() {
  var fs = require('fs')
  var postcss = require('postcss')
  var postcssCriticalCSS = require('postcss-critical-css');
  const sourcePath = 'assets/css/';
  const destPath = 'assets/compile';

  function cb (files) {
    function useFileData (data, file) {
      postcss([postcssCriticalCSS({outputPath: destPath})])
        .process(data)
        .then(result => fs.writeFile(
          `${destPath}/${file.split('.')[0]}.non-critical.css`, result.css))
    }
    files.forEach(function(file) {
      if (file === 'main.css') {
        fs.readFile(`${sourcePath}/${file}`, 'utf8', (err, data) => {
          if (err) {
            throw new Error(err)
          }
          useFileData(data, file)
        })
      }
    })
  }

  fs.readdir(sourcePath, 'utf8', (err, files) => {
    if (err) {
      throw new Error(err)
    }
    cb(files)
  })
});
