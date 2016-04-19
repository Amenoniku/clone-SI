'use strict'

Bullet = require "./bullet"

class Player
	constructor: (@data) ->
		@screenWidth = @data.scrSize.x - 40
		@size = width: 28, height: 12
		@pos = x: (@data.scrSize.x / 2) - (@size.width / 2), y: @data.scrSize.y - 30
		@icon = x: 138.5, y: 75
		@x = @pos.x
		do @conrtoller

	update: ->
		if @x < 10 then @x = 10
		if @x > @screenWidth then @x = @screenWidth
		@pos.x = @x

	shoot: (event) =>
		do event.preventDefault
		bullet = new Bullet {x: @pos.x + @size.width / 2, y: @pos.y - 12}, {speed: 4, dir: no}
		@data.objects.push bullet

	conrtoller: ->
		@data.screen.addEventListener "mousemove", (e) =>
			@x = e.offsetX - @size.width / 2
		@data.screen.addEventListener "click", @shoot

module.exports = Player