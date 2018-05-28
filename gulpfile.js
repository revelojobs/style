const gulp = require('gulp');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const liveReload = require('gulp-livereload');
const browserSync = require('browser-sync');

gulp.task('styles', () => {
  return gulp.src('./src/stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('minify-styles', () => {
  return gulp.src('./dist/stylesheets/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('style-helpers', () => {
  const paths = ['functions', 'variables'];
  const base  = './src/stylesheets/';
  const dist  = './dist/stylesheets';

  return paths.forEach((path) => {
    let src = base + path + '/**/*';
    gulp.src(src, { base: base }).pipe(gulp.dest(dist));
  });
});

gulp.task('images', () => {
  return gulp.src('./src/images/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/images'))
});

gulp.task('watch', () => {
  liveReload.listen();

  gulp.watch('./src/stylesheets/**/*', ['styles']);
  gulp.watch('./src/images/**/*',      ['images']);
});

gulp.task('serve', ['styles'], () => {
  const browserSyncInstance = browserSync.create();

  browserSyncInstance.init({
    port: 8000,
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch('./dist/**/*').on('change', browserSyncInstance.reload);
});

gulp.task('default', () => {
  runSequence('styles', 'images', 'serve', 'watch');
});

gulp.task('build', () => {
  runSequence('styles', 'images', 'minify-styles', 'style-helpers');
});