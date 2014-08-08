/**
 *
 *  A modern grunt build script
 *  Copyright 2014 Falko Behr. All rights reserved.
 *
 */


/* jshint node:true */

module.exports = function( grunt ) {
    require( "load-grunt-tasks" )( grunt );
    require( "time-grunt" )( grunt );

    grunt.initConfig({
        pkg: grunt.file.readJSON( "package.json" ),
        banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                "<%= grunt.template.today('yyyy-mm-dd hh:mm:ss') %> - " +
                "Copyright <%= pkg.author.name %>, <%= pkg.author.url %> */",
        clean: {
            tmp: [ ".tmp" ],
            dev: [ "**/.DS_Store*" ],
            dist: [ "<%= pkg.path.dist %>" ]
        },
        copy: {
            dist: {
                cwd: "<%= pkg.path.dev %>",
                dest: "<%= pkg.path.dist %>",
                expand: true,
                filter: "isFile",
                flatten: false,
                src: [
                    "**",
                    "!**/_*/**",
                    "!**/_*.*",
                    "!**/*.sh",
                    "!**/.git/**",
                    "!**/.gitignore",
                    "!**/.DS_Store",
                    "!**/.sass-cache*,",
                    "!**/.tmp*",
                    "!Gruntfile.js",
                    "!**/*.md",
                    "!**/app/**",
                    "!**/dist/**",
                    "!**/node_modules/**",
                    "!**/styles/**",
                    "!**/scripts/**",
                    ".htaccess"
                ]
            },
            prod: {
                cwd: "<%= pkg.path.dev %>",
                dest: "<%= pkg.path.dist %>",
                expand: true,
                filter: "isFile",
                flatten: false,
                src: [
                    "<%= copy.dist.src %>",
                    "!**/robots.txt/**"
                ]
            }
        },
        sass: {
            dev: {
                options: {
                    noCache: true,
                    style: "expanded"
                },
                files: {
                    "<%= pkg.path.dev %>/<%= pkg.path.src.css %>/styles.css":
                        "<%= pkg.path.dev %>/<%= pkg.path.src.sass %>/styles.scss"
                }
            },
            dist: {
                options: {
                    banner: "<%= banner %>",
                    noCache: true,
                    style: "compressed"
                },
                files: {
                    "<%= pkg.path.dist %>/<%= pkg.path.src.css %>/styles.min.css":
                        "<%= pkg.path.dev %>/<%= pkg.path.src.sass %>/styles.scss"
                }
            }
        },
        sassFormat: {
            options: {
                indentChar: " ",
                indentStep: 4,
                blankLine: {
                    property: true,
                    close: true
                },
                whiteSpace: {
                    selector: false,
                    property: true
                },
                order: true,
                lang: "en",
                debug: false
            },
            files: [
                "<%= pkg.path.dev %>/<%= pkg.path.src.sass %>/_reset.scss",
                "<%= pkg.path.dev %>/<%= pkg.path.src.sass %>/_page.scss",
                "<%= pkg.path.dev %>/<%= pkg.path.src.sass %>/styles.scss"
            ]
        },
        jshint: {
            files: [
                "Gruntfile.js",
                "<%= pkg.path.dev %>/data/*.json",
                "<%= pkg.path.dev %>/<%= pkg.path.src.js %>/*.js",
                "!<%= pkg.path.dev %>/<%= pkg.path.src.js %>/libs/*"
            ],
            options: {
                jshintrc: "grunt/.jshintrc",
                reporter: require( "jshint-stylish" )
            }
        },
        jscs: {
            files: [ "<%= jshint.files %>" ],
            options: {
                config: "grunt/.jscsrc"
            }
        },
        uglify: {
            options: {
                banner: "<%= banner %>"
            }
        },
        replace: {
            logs: {
                src: [ ".tmp/concat/<%= pkg.path.dist %>/<%= pkg.path.src.js %>/scripts.min.js" ],
                dest: [ ".tmp/concat/<%= pkg.path.dist %>/<%= pkg.path.src.js %>/scripts.min.js" ],
                replacements: [ {
                    from: "console.",
                    to: "//console."
                },
                {
                    from: "alert(",
                    to: "//alert(."
                } ]
            },
            debug: {
                src: [ "<%= pkg.path.dist %>/<%= pkg.path.src.index %>" ],
                dest: [ "<%= pkg.path.dist %>/<%= pkg.path.src.index %>" ],
                replacements: [ {
                    from: /<script[^>]*exclude><\/script>/gi,
                    to: ""
                } ]
            },
            humans: {
                src: [ "<%= pkg.path.dist %>/humans.txt" ],
                dest: [ "<%= pkg.path.dist %>/humans.txt" ],
                replacements: [ {
                    from: "UPDATED",
                    to: grunt.template.today( "yyyy-mm-dd hh:mm:ss" )
                } ]
            },
            paths: {
                src: [ "<%= pkg.path.dist %>/<%= pkg.path.src.index %>" ],
                dest: [ "<%= pkg.path.dist %>/<%= pkg.path.src.index %>" ],
                replacements: [ {
                    from: "<%= pkg.path.dist %>/",
                    to: ""
                } ]
            }
        },
        useminPrepare: {
            html: [ "<%= pkg.path.dist %>/<%= pkg.path.src.index %>" ],
            options: {
                dest: "./",
                concat: "generated"
            }
        },
        usemin: {
            html: [ "<%= pkg.path.dist %>/<%= pkg.path.src.index %>" ]
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [ {
                    cwd: "<%= pkg.path.dist %>",
                    expand: true,
                    src: [
                        "**/*.html",
                        "**/*.php",
                        "!**/_*.*",
                        "!**/classes/**"
                    ],
                    dest: "<%= pkg.path.dist %>"
                } ]
            }
        },
        imagemin: {
            png: {
                options: {
                    cache: false,
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [ {
                    cwd: "<%= pkg.path.dist %>/<%= pkg.path.src.images %>/",
                    dest: "<%= pkg.path.dist %>/<%= pkg.path.src.images %>/",
                    expand: true,
                    ext: ".png",
                    src: [ "**/*.png" ]
                } ]
            },
            jpg: {
                options: {
                    cache: false,
                    progressive: true
                },
                files: [ {
                    cwd: "<%= pkg.path.dist %>/<%= pkg.path.src.images %>/",
                    dest: "<%= pkg.path.dist %>/<%= pkg.path.src.images %>/",
                    expand: true,
                    ext: ".jpg",
                    src: [ "**/*.jpg" ]
                } ]
            }
        },
        "ftp-deploy": {
            css: {
                auth: {
                    host: "100264.webhosting36.1blu.de",
                    port: 21,
                    authKey: "development"
                },
                src: "<%= pkg.path.dev %>/<%= pkg.path.src.css %>",
                dest: "/<%= pkg.path.dist %>/<%= pkg.path.src.css %>",
                exclusions: [
                    "/**/.DS_Store",
                    "/**/Thumbs.db"
                ],
                keep: [ "/" ],
                rmdir: [ "/" ]
            },
            prod: {
                auth: {
                    host: "100264.webhosting36.1blu.de",
                    port: 21,
                    authKey: "production"
                },
                src: "<%= pkg.path.dist %>",
                dest: "/<%= pkg.path.prod %>",
                exclusions: [
                    "/**/.DS_Store",
                    "/**/Thumbs.db"
                ],
                keep: [ "/prod/" ],
                rmdir: [ "/prod/" ]
            }
        },
        validation: {
            options: {
                relaxerror: [
                    "Bad value X-UA-Compatible for attribute http-equiv on element meta.",
                    "document type does not allow element \"SCRIPT\" here"
                ],
                reset: false,
                stoponerror: true
            },
            files: {
                src: [
                    "<%= pkg.path.dev %>/<%= pkg.path.src.index %>"
                ]
            }
        },
        phplint: {
            options: {
                phpCmd: "/usr/bin/php", // Or "c:\EasyPHP-5.3.8.1\PHP.exe"
                phpArgs: {
                    "-l": null
                },
                spawnLimit: 10
            },
            all: [
                "app/**/*.php"
            ]
        },
        jsonlint: {
            src: [ "app/**/*.json" ]
        },
        "json-minify": {
            dist: {
                files: "<%= pkg.path.dist %>/**/*.json"
            }
        },
        watch: {
            sass: {
                files: "<%= pkg.path.dev %>/**/*.scss",
                options: {
                    livereload: true
                },
                tasks: [
                    "sassFormat",
                    "sass:dev"
                ]
            },
            js: {
                files: [ "<%= jshint.files %>" ],
                tasks: [
                    "jshint",
                    "jscs"
                ]
            },
            dev: {
                files: [
                    "<%= pkg.path.dev %>/**/*.scss",
                    "<%= jshint.files %>"
                ],
                tasks: [
                    "jshint",
                    "jscs",
                    "sassFormat",
                    "sass:dev",
                    "ftp-deploy:css"
                ]
            }
        },
        yslow: {
            options: {
                thresholds: {
                    weight: 1800,
                    speed: 10000,
                    score: 90,
                    requests: 150
                }
            },
            pages: {
                files: [ {
                    src: "<%= pkg.url.development %>"
                } ]
            }
        }
    });

    grunt.file.setBase( "../" );

    grunt.registerTask( "speed", [
        "yslow"
    ]);

    grunt.registerTask( "default", [
        "watch:dev"
    ]);

    grunt.registerTask( "validate", [
        "jshint",
        "jscs",
        "jsonlint",
        "validation",
        "phplint:all",
        "sassFormat"
    ]);

    grunt.registerTask( "compile", [
        "sassFormat",
        "sass:dev"
    ]);

    grunt.registerTask( "destroy", [
        "clean:dev",
        "clean:dist"
    ]);

    grunt.registerTask( "deploy", function( target ) {
        if ( target !== "watch" ) {
            grunt.task.run([
                "jshint",
                "jscs",
                "clean:dist",
                "copy:dist",
                "sass:dist",
                "replace:debug",
                "useminPrepare",
                "concat",
                "replace:logs",
                "uglify",
                "usemin",
                "json-minify:dist",
                "htmlmin:dist",
                "imagemin:png",
                "imagemin:jpg",
                "replace:humans",
                "clean:tmp"
            ]);
        }
    });

    grunt.registerTask( "deploy-prod", function( target ) {
        if ( target !== "watch" ) {
            grunt.task.run([
                "jshint",
                "jscs",
                "clean:dist",
                "copy:prod",
                "sass:dist",
                "replace:debug",
                "useminPrepare",
                "concat",
                "replace:logs",
                "uglify",
                "usemin",
                "json-minify:dist",
                "htmlmin:dist",
                "imagemin:png",
                "imagemin:jpg",
                "replace:humans",
                "clean:tmp",
                "ftp-deploy:prod"
            ]);
        }
    });

};
