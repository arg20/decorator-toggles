import {Gulpclass, Task, SequenceTask, MergedTask} from 'gulpclass/Decorators';

import * as gulp from 'gulp';
import * as del from 'del';
import * as ts from 'gulp-typescript';
import * as nodemon from 'gulp-nodemon';
import * as mocha from 'gulp-mocha';

var tsProject = ts.createProject('tsconfig.json');

@Gulpclass()
export class Gulpfile {

    @Task()
    clean(next: Function) {
        return del(['./build/**'], next);
    }

    @MergedTask()
    compile() {
        let tsResult = tsProject
            .src()
            .pipe(tsProject());

        return [
            tsResult.js.pipe(gulp.dest('build')),
            tsResult.dts.pipe(gulp.dest('build'))
        ];
    }

    @Task()
    watch() {
        gulp.watch(['**/*.ts', '!gulpfile.ts', '!build/', '.env'], ['compile']);
    }

    @Task()
    e2e() {
        process.env.NODE_ENV = 'test';
        gulp.src(['build/**/*.e2e.js', 'build/**/*.test.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
            .pipe(mocha({timeout: 10000}))
            .once('end', () => {
                process.exit();
            });
    }

    @SequenceTask()
    test() {
        return ['clean', 'compile', 'e2e'];
    }

    @SequenceTask()
    build() {
        return ['clean', 'compile'];
    }

    @SequenceTask()
    default() {
        return ['build'];
    }

    @SequenceTask()
    serve() {
        return ['clean', 'compile', 'run', 'watch'];
    }

    @Task()
    run(next: Function) {
        let stream = nodemon({
            script: './build/test/controller.test.js',
            ext: 'js json',
            watch: ['build/**.js']
        });

        next();
    }

}