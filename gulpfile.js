import gulp from 'gulp';
import {path} from './gulp/config/path.js';
import {plugins} from './gulp/config/plugins.js';

global.app = {
    isBuild:    process.argv.includes('--build'),
    isDev:      !process.argv.includes('--build'),
    path:       path,
    gulp:       gulp,
    plugins:    plugins
}

import {clean} from './gulp/tasks/clean.js';
import {html} from './gulp/tasks/html.js';
import {serve} from './gulp/tasks/serve.js';
import {css} from './gulp/tasks/css.js';
import {js} from './gulp/tasks/js.js';
import {img} from './gulp/tasks/img.js';
import {otf2ttf, ttf2woff, fontsStyle} from './gulp/tasks/fonts.js';
import {phpmailer, myphp} from './gulp/tasks/php.js';

function watch () {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, img);
};

const fonts = gulp.series(otf2ttf, ttf2woff, fontsStyle);

const dev = gulp.series(
    clean,
    gulp.series(
        fonts,
        gulp.parallel(
            html,
            css,
            js,
            img
        )
    ),
    gulp.parallel(
        watch,
        serve
    )
);

const build = gulp.series(
    clean,
    gulp.series(
        fonts,
        gulp.parallel(
            html,
            css,
            js,
            img
        )
    )
)

export {dev};
export {build};

gulp.task('clean', clean);
gulp.task('php', gulp.parallel(phpmailer, myphp));
gulp.task('default', dev);