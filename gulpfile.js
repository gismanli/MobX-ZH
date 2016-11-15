/**
 * @file gulpfile
 */

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function () {
    require('child_process').exec('gitbook build');
    gulp.src('_book/**/*.*')
        .pipe(ghPages())
        .on("error", function(err){
            console.log(err);
        })
});