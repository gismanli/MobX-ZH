/**
 * @file gulpfile
 */

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function () {
    return gulp.src('_book/**/*.*')
        .pipe(ghPages())
        .on("error", function(err){
            console.log(err);
        })
});