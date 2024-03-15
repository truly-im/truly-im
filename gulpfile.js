import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import rollup from "@rbnlffl/gulp-rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import commonjs from "@rollup/plugin-commonjs";
import rename from "gulp-rename";
import webserver from "gulp-webserver";
import gulpIf from "gulp-if";
import changed from "gulp-changed";
let webChanged = false;
function pipeEnd(stream) {
    return new Promise((resolve) => {
        stream.on("end", () => {
            resolve(stream);
        });
    });
}
function buildCore() {
    return new Promise((resolve) => {
        gulp.src("./src/core/**/*.ts")
            .pipe(sourcemaps.init())
            .pipe(
                rollup(
                    {
                        plugins: [
                            nodeResolve(),
                            commonjs(),
                            typescript({
                                tsconfig: "./tsconfig.json",
                            }),
                            swc({
                                env: {
                                    targets: "> 0.2%, not dead",
                                    mode: "entry",
                                    coreJs: "3.25",
                                },
                            }),
                        ],
                    },
                    {
                        format: "cjs",
                    }
                )
            )
            .pipe(
                rename(function (path) {
                    if (path.extname == ".ts") path.extname = ".js";
                })
            )
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/core"));
        resolve();
    });
}
function buildWeb() {
    return new Promise(async (resolve) => {
        await pipeEnd(
            gulp
                .src("./src/web/**/*.ts")
                .pipe(
                    gulpIf(
                        webChanged,
                        changed("dist/web", { extension: ".js" })
                    )
                )
                .pipe(sourcemaps.init())
                .pipe(
                    rollup(
                        {
                            plugins: [
                                nodeResolve(),
                                commonjs(),
                                typescript({
                                    tsconfig: "./tsconfig.json",
                                }),
                                swc({
                                    jsc: {
                                        target: "es5",
                                    },
                                    env: {
                                        targets: "> 0.2%",
                                        mode: "entry",
                                        coreJs: "3.25",
                                        forceAllTransforms: true,
                                    },
                                }),
                            ],
                        },
                        {
                            format: "es",
                        }
                    )
                )
                .pipe(
                    rename(function (path) {
                        if (path.extname == ".ts") path.extname = ".js";
                    })
                )
                .pipe(sourcemaps.write("."))
                .pipe(gulp.dest("dist/web"))
        );
        await pipeEnd(
            gulp.src("./src/web/**/*.html").pipe(gulp.dest("dist/web"))
        );
        resolve();
    });
}
function devWebServer() {
    webChanged = true;
    gulp.watch("src/**/*", gulp.series(buildWeb));
    return gulp.src("dist/web").pipe(
        webserver({
            livereload: true,
        })
    );
}
gulp.task("build:core", gulp.series([buildCore]));
gulp.task("build:web", gulp.series([buildWeb]));
gulp.task("dev:web", gulp.series([buildWeb, devWebServer]));
