'use strict'

class Bullet
	constructor: (@pos, @gravity) ->
		@size = width: 3, height: 7

	update: ->
		unless @gravity.dir then @pos.y -= @gravity.speed
		else @pos.y += @gravity.speed

module.exports = Bullet