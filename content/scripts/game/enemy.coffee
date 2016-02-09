'use strict'

Bullet = require "./bullet"

class Enemy
	constructor: (@data, @pos, @size, @ind) ->
		@moveX = 0
		@speed = 1

	update: ->
		if @moveX < 0 or @moveX > @data.scrSize.x / 3
			@speed = -@speed
		@pos.x += @speed
		@moveX += @speed
		do @shoot

	isLower: (enemy) ->
		@data.objects.filter (o) ->
			o instanceof Enemy and
			o.pos.y > enemy.pos.y and
			o.pos.x - enemy.pos.x < enemy.size.width
		.length > 0

	shoot: ->
		if do Math.random < 0.02 and !@isLower @
			bulletCoors =
				x: @pos.x + @size.width / 2
				y: @pos.y + @size.height / 2 + @size.height / 2 
			bullet = new Bullet bulletCoors, speed: 3, dir: on
			@data.objects.push bullet

module.exports = Enemy