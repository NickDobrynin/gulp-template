import replace from 'gulp-replace';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import gulpIf from 'gulp-if';
import browsersync from 'browser-sync';

export const plugins = {
    replace:        replace,
    plumber:        plumber,
    notify:         notify,
    newer:          newer,
    if:             gulpIf,
    browsersync:    browsersync
}