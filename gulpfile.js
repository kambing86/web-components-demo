const gulp = require('gulp');
const srcPath = 'src/';
const outputPath = 'dist/';

function copyFiles() {
  return gulp
    .src(['src/index.html', 'src/assets/**', 'src/mocks/**'], { base: srcPath })
    .pipe(gulp.dest(outputPath));
}

exports.default = gulp.parallel([copyFiles]);
