module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // ---------------------------------------------------------
        // Property
        distFolder: "dist",
        tempFolder: "tmp",

        // ---------------------------------------------------------
        // Execute code in node
        // https://www.npmjs.com/package/grunt-execute
        execute: {
            target: {
                src: ["server.js"]
            }
        },

        // ---------------------------------------------------------
        // Grunt task to generate a RESTful API Documentation with apidoc
        // https://www.npmjs.com/package/grunt-apidoc
        // http://apidocjs.com/
        apidoc: {
            api_rest: {
                src: "app/routes/",
                dest: "apidoc/",
                options: {
                    debug: false,
                    log: true,
                    simulate: false,
                    includeFilters: [".*\\.js$"],
                    excludeFilters: ["node_modules/"]
                }
            }
        },

        // ---------------------------------------------------------
        // Clear all temporary artifact
        clean: {
            build: {
                src: ["<%= distFolder %>/", "<%= tempFolder %>/"]
            }
        },

        // ---------------------------------------------------------
        // Install and update npm and bower dependencies.
        // It looks for 'package.json' and 'bower.json' files, and runs 'npm install' and 'bower install' respectively only if they exist.
        // https://www.npmjs.com/package/grunt-auto-install
        auto_install: {
            local: {},
            build: {
                options: {
                    cwd: "<%= distFolder %>/",
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    npm: "--production --no-bin-links",
                    bower: false
                }
            }
        },

        // ---------------------------------------------------------
        // Copy files and folders
        // https://www.npmjs.com/package/grunt-contrib-copy
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: ".",
                        src: ["package.json", "README.md", "license", "restapi-as-daemon"],
                        dest: "<%= distFolder %>/",
                        filter: "isFile"
                    },
                    {
                        expand: true,
                        cwd: ".",
                        src: ["server.js"],
                        dest: "<%= distFolder %>/",
                        filter: "isFile"
                    },
                    {
                        expand: true,
                        cwd: ".",
                        src: ["app/**"],
                        dest: "<%= distFolder %>/"
                    },
                    {
                        expand: true,
                        cwd: "./<%= tempFolder %>",
                        src: ["config/*.js"],
                        dest: "<%= distFolder %>/app"
                    },
                    {
                        expand: true,
                        cwd: ".",
                        src: ["apidoc/**"],
                        dest: "<%= distFolder %>/"
                    },
                    {
                        expand: true,
                        cwd: ".",
                        src: ["log/**"],
                        dest: "<%= distFolder %>/"
                    }
                  ]
            },
            placeholder: {
                files: [
                    {
                        expand: true,
                        cwd: "./app/config",
                        src: ["*.js"],
                        dest: "<%= tempFolder %>/config_2_replace",
                        filter: "isFile"
                    },
                    {
                        expand: true,
                        cwd: "./environment",
                        src: ["<%= TARGET %>.json"],
                        dest: "<%= tempFolder %>/config_2_replace",
                        filter: "isFile"
                    }],
                options: {
                    process: function(content, path) {
                        return grunt.template.process(content);
                    }
                }
            }
        },

        // ---------------------------------------------------------
        // Specify an ENV configuration for future tasks in the chain
        // https://www.npmjs.com/package/grunt-env
        env: {
            dev: {
                target: "dev"
            },
            prod: {
                target: "prod"
            }
        },

        // ---------------------------------------------------------
        // Grunt Task for replacing placeholders in source files with values from a configuration file
        // https://www.npmjs.com/package/grunt-placeholder
        placeholder: {
            config_env: {
                files: [{
                    cwd: "<%= tempFolder %>/config_2_replace",
                    src: ["**/*.js"],
                    dest: "<%= tempFolder %>/config"
                  }],
                options: {
                    configFile: "<%= TARGET %>.json",
                    //configFile: "dev.json",
                    configType: "json"
                }
            }
        },

        // ---------------------------------------------------------
        // Run predefined tasks whenever watched file patterns are added, changed or deleted
        // https://www.npmjs.com/package/grunt-contrib-watch
        watch: {
            sync_file: {
                files: ["app/**/*.js", "environment/*.json", "*.js"],
                tasks: ["sync"],
                options: {
                    spawn: true
                }
            }
        },

        // ---------------------------------------------------------
        // Task to synchronize two directories.
        // Similar to grunt-copy but updates only files that have been changed.
        // https://www.npmjs.com/package/grunt-sync
        sync: {
            main: {
                files: [{
                    //cwd: ".",
                    src: [
                            "app/**/*.js",
                            //"app/services/*.js",
                            //"environment/*.json",
                            //"*.js",
                            "!**/*.txt" /* but exclude txt files */
                            ],
                    dest: "<%= distFolder %>"
                    }],
                pretend: true, // Don"t do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn"t remove too much.
                verbose: false, // Display log messages when copying files
                failOnError: true // Fail the task when copying is not possible. Default: false
                    //ignoreInDest: "**/*.js", // Never remove js files from destination. Default: none
                    //updateAndDelete: true, // Remove all files from dest that are not found in src. Default: false
                    //compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
            }
        },

        // ---------------------------------------------------------
        // Grunt task to run a nodemon monitor of your node.js server
        // https://www.npmjs.com/package/grunt-nodemon
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });
                    },
                    env: {
                        PORT: '1500'
                    },
                    //cwd: __dirname,
                    cwd: "<%= distFolder %>/",
                    ignore: ['node_modules/**'],
                    ext: 'js',
                    watch: ['app'],
                    delay: 3000,
                    legacyWatch: true
                }
            }
        },

        // ---------------------------------------------------------
        // Run grunt tasks concurrently
        // https://www.npmjs.com/package/grunt-concurrent
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-execute");
    grunt.loadNpmTasks("grunt-auto-install");
    grunt.loadNpmTasks("grunt-apidoc");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-placeholder");
    grunt.loadNpmTasks("grunt-env");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-sync");
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");

    grunt.registerTask("loadconst", "Load constants", function() {
        grunt.config("TARGET", process.env.target);
    });

    // Default task(s).
    grunt.registerTask("default", [
		"dev"
	]);

    grunt.registerTask("prod", [
		"env:prod",
		"build"
	]);

    grunt.registerTask("dev", [
		"env:dev",
		"build",
		//"dev-watch-nodemon"
		"watch"
	]);

    grunt.registerTask("build", [
		    "loadconst",
        "copy:placeholder",
        "placeholder",
        "copy:build",
        "auto_install:build"
	]);

    grunt.registerTask("dev-watch-nodemon", ["concurrent"]);

};
