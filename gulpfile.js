import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import rollup from "@rbnlffl/gulp-rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import commonjs from "@rollup/plugin-commonjs";
async function buildCore() {
    await new Promise((resolve) => {
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
                                    targets: "> 0.25%, not dead",
                                    mode: "entry",
                                    coreJs: "3.25",
                                },
                            }),
                        ],
                    },
                    {
                        format: "es",
                    }
                )
            )
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/core"));
        resolve();
    });
}
gulp.task("build:core", gulp.series([buildCore]));
gulp.task("build:web", gulp.series([buildCore]));
