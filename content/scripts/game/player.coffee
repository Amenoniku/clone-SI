'use strict'

Bullet = require "./bullet"

class Player
	constructor: (@data) ->
		@size = width: 20, height: 15
		@pos = x: (@data.scrSize.x / 2) - (@size.width /2), y: @data.scrSize.y - 30
		@x = @pos.x
		do @conrtoller

	update: ->
		width = @data.scrSize.x - 30
		if @x < 10 then @x = 10
		if @x > width then @x = width 
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