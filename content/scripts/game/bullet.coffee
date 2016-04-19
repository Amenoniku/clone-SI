'use strict'

class Bullet
	constructor: (@pos, @gravity) ->
		@size = width: 3, height: 6
		@icon = x: 152, y: 65

	update: ->
		unless @gravity.dir then @pos.y -= @gravity.speed
		else @pos.y += @gravity.speed

module.exports = Bullet