gulp = require "gulp"
plumber = require "gulp-plumber"
spritesmith = require "gulp.spritesmith"
paths = require "../paths"

gulp.task "sprite", ->
	spriteData = gulp.src "content/images/sprite/**/*.png", read: no
		.pipe do plumber
		.pipe spritesmith
			imgName: "sprite.png"
			cssName: "sprite.styl"
			imgPath: "../images/sprite.png"
			cssFormat: "stylus"
			algorithm: "binary-tree"
			engine: "pngsmith"
			padding: 3
			imgOpts: 
				format: "png"

	spriteData.img.pipe gulp.dest paths.images
	spriteData.css.pipe gulp.dest paths.appStylesHelpers