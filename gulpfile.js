(function () {

  var gulp = require('gulp'),
      jade = require('gulp-jade'),
      gutil = require('gulp-util'),
      clean = require('gulp-clean'),
      babel = require('gulp-babel'),
      react = require('gulp-react'),
      uglify = require('gulp-uglify'),
      stylus = require('gulp-stylus'),
      svgmin = require('gulp-svgmin'),
      connect = require('gulp-connect'),
      imagemin = require('gulp-imagemin'),
      svgstore = require('gulp-svgstore'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer');

  /**
   * Configuration object constructor
   */
  function Config(assets, build) {
    this.assets = {
      root: './assets/',
      templates: './assets/templates/',
      scripts: {
        src: './assets/scripts/',
        libs: './assets/scripts/libs/**/*.js'
      },
      styles: {
        src: './assets/styles/',
        libs: './assets/styles/libs/**/*.css'
      },
      media: {
        images: {
          vector: './assets/media/images/vector/**/*.*',
          raster: './assets/media/images/raster/**/*.*',
          sprites: './assets/media/images/sprites/'
        },
        fonts: './assets/media/fonts/**/*.*'
      }
    };

    this.app = {
      root: './app',
      scripts: './app/js/',
      styles: './app/css',
      media: {
        images: './app/media/images',
        fonts: './app/media/fonts'
      }
    };

    this.server = {
      root: 'app',
      port: 8080
    };
  }



  /**
   *
   * CONFIGS
   *
   */
  
  var config = new Config();


  /**
   *
   * ALIAS TO MAIN CONFIG PROPS
   *
   */
  
  var assets = config.assets,
      app = config.app;



  /**
   *
   * SERVER TASK
   *
   */
  
  gulp.task('connect', () => {
    connect.server({
      root: config.server.root,
      port: config.server.port,
      livereload: true
    });
  });



  /*=====================================================
  =            DEVELOPMENT ENVIRONMENT TASKS            =
  =====================================================*/
  gulp.task('dev:templates', done => {
    return gulp
              .src(assets.templates + 'index.jade')
              .pipe(sourcemaps.init())
              .pipe(jade({
                pretty: true
              }))
              .on('error', err => {
                gutil.log(gutil.colors.red(err));
                done();
              })
              .pipe(sourcemaps.write())
              .pipe(gulp.dest(app.root))
              .pipe(connect.reload());
  });


  gulp.task('dev:styles', done => {
    return gulp
              .src(assets.styles.src + '*.styl')
              .pipe(sourcemaps.init())
              .pipe(stylus())
              .on('error', err => {
                gutil.log(gutil.colors.red(err));
                done();
              })
              .pipe(autoprefixer())
              .pipe(sourcemaps.write())
              .pipe(gulp.dest(app.styles))
              .pipe(connect.reload());
  });


  gulp.task('dev:styles-libs', () => {
    return gulp
              .src(assets.styles.libs)
              .pipe(gulp.dest(app.styles));
  });


  gulp.task('dev:scripts', () => {
    return gulp
              .src([assets.scripts.libs, assets.scripts.src + '*.js', assets.scripts.src + '*.jsx'])
              .pipe(sourcemaps.init())
              .pipe(react())
              .on('error', err => {
                gutil.log(gutil.colors.red(err));
                done();
              })
              .pipe(sourcemaps.write())
              .pipe(gulp.dest(app.scripts))
              .pipe(connect.reload());
  });


  gulp.task('dev:media-raster', () => {
    return gulp
              .src(assets.media.images.raster)
              .pipe(gulp.dest(app.media.images))
              .pipe(connect.reload());
  });


  gulp.task('dev:media-vector', () => {
    return gulp
              .src(assets.media.images.vector)
              .pipe(svgstore())
              .pipe(gulp.dest(assets.media.images.sprites));
  });
  /*=====  End of DEVELOPMENT ENVIRONMENT TASKS  ======*/




  /*====================================================
  =            PRODUCTION ENVIRONMENT TASKS            =
  ====================================================*/
  gulp.task('prod:templates', () => {
    return gulp
              .src(assets.templates)
              .pipe(jade())
              .pipe(gulp.dest(app.root));
  });


  gulp.task('prod:styles', () => {
    return gulp
              .src([assets.styles.libs, assets.styles.src])
              .pipe(stylus({
                compress: true
              }))
              .pipe(autoprefixer())
              .pipe(gulp.dest(app.styles));
  });


  gulp.task('prod:scripts', () => {
    return gulp
              .src([assets.scripts.libs, assets.scripts.src])
              .pipe(react())
              .pipe(uglify())
              .pipe(gulp.dest(app.scripts));
  });


  gulp.task('prod:media-raster', () => {
    return gulp
              .src(assets.media.images.raster)
              .pipe(imagemin([
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
              ]))
              .pipe(gulp.dest(app.media.images));
  });


  gulp.task('prod:media-vector', () => {
    return gulp
              .src(assets.media.images.vector)
              .pipe(svgmin())
              .pipe(svgstore())
              .pipe(gulp.dest(assets.media.images.sprites))
  });
  /*=====  End of PRODUCTION ENVIRONMENT TASKS  ======*/



  /*===================================
  =            MEDIA TASKS            =
  ===================================*/
  gulp.task('media:replace-sprite', () => {
    return gulp
              .src(assets.media.images.sprites + 'vector.svg')
              .pipe(gulp.dest(app.media.images))
              .pipe(connect.reload());
  });


  gulp.task('media:fonts', () => {
    return gulp
              .src(assets.media.fonts)
              .pipe(gulp.dest(app.media.fonts))
              .pipe(connect.reload());
  });


  gulp.task('dev:media', gulp.parallel(gulp.series('dev:media-vector', 'media:replace-sprite'), 'dev:media-raster', 'media:fonts'));
  gulp.task('prod:media', gulp.parallel('prod:media-vector', 'prod:media-raster', 'prod:media-vector', 'media:fonts'));
  /*=====  End of MEDIA TASKS  ======*/



  /*===================================
  =            CLEAN TASKS            =
  ===================================*/
  gulp.task('clean:all', done => {
    return gulp
              .src(app.root, {read: false})
              .on('error', err => {
                gutil.log(gutil.colors.yellow(err));
                done();
              })
              .pipe(clean());
  });

  gulp.task('clean:templates', done => {
    return gulp
              .src(app.root + '/app.html', {read: false})
              .on('error', err => {
                gutil.log(gutil.colors.yellow(err));
                done();
              })
              .pipe(clean());
  });


  gulp.task('clean:styles', done => {
    return gulp
              .src(app.styles, {read: false})
              .on('error', err => {
                gutil.log(gutil.colors.yellow(err));
                done();
              })
              .pipe(clean());
  });


  gulp.task('clean:scripts', done => {
    return gulp
              .src(app.scripts, {read: false})
              .on('error', err => {
                gutil.log(gutil.colors.yellow(err));
                done();
              })
              .pipe(clean());
  });

  gulp.task('clean:media', done => {
    return gulp
              .src(app.root + '/media/**/*.*', {read: false})
              .on('error', err => {
                gutil.log(gutil.colors.yellow(err));
                done();
              })
              .pipe(clean());
  });
  /*=====  End of CLEAN TASKS  ======*/



  gulp.task('build:dev', gulp.series('clean:all', 'dev:templates', 'dev:styles', 'dev:styles-libs', 'dev:scripts', 'dev:media'));
  gulp.task('build:prod', gulp.series('clean:all', gulp.parallel('prod:templates', 'prod:styles', 'prod:scripts', 'prod:media')));



  /*===================================
  =            WATCH TASKS            =
  ===================================*/
  gulp.task('watch:scripts', () => {
    gulp.watch([assets.scripts.src + '**/*.js', assets.scripts.src + '**/*.jsx'], gulp.series('clean:scripts', 'dev:scripts'));
  });


  gulp.task('watch:styles', () => {
    gulp.watch(assets.styles.src + '**/*.styl', gulp.series('clean:styles', 'dev:styles', 'dev:styles-libs'));
  });


  gulp.task('watch:templates', () => {
    gulp.watch(assets.templates + '**/*.jade', gulp.series('clean:templates', 'dev:templates'));
  });


  gulp.task('watch:media', () => {
    gulp.watch(assets.root + 'media/**/*.*', gulp.series('clean:media', 'dev:media'));
  });


  gulp.task('watch:all', gulp.series('build:dev', gulp.parallel('watch:scripts', 'watch:styles', 'watch:templates', 'watch:media')));
  /*=====  End of WATCH TASKS  ======*/



  gulp.task('default', gulp.parallel('connect', 'watch:all'));
}());