import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import groupMedia from 'gulp-group-css-media-queries';

const sass = gulpSass(dartSass);

export const css = () => {
    return app.gulp.src(app.path.src.css, {sourcemaps: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title:      'SCSS',
                message:    'Error: <%= error.message %>'
            })
        ))
        .pipe(sass({
            outputStyle:    'expanded'
        }))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            grid:                   true,
            overrideBrowserlist:    ['last 5 versions'],
            cascade:                true
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(cleanCss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream());
}