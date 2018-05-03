var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  return gulp.src([
  	'./less/styles/style.less',
  	'./less/styles/style-green-color.less',
  	'./less/animations.less'
  ]).pipe(less({
      paths: [ path.join(__dirname, 'less') ]
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('default', ['less']);
