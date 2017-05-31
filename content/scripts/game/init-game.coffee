'use strict'

Player = require "./player"
Enemy = require './enemy'
Score = require "./score"
Bullet = require "./bullet"



class InitGame
	constructor: (@screen) ->
		@ctx = @screen.getContext '2d'
		@scrSize = x: @screen.width, y: @screen.height
		@objects = []
		@stopAnimation = no
		@logicTimer = no
		@icons = new Image
		@icons.src = './images/icons.png'


	start: ->
		@icons.onload = =>
			do @addObjects
			do @tick
			do @logic

	addObjects: ->
		@objects.push new Score @
		@objects.push new Player @
		do @addEnemies


	tick: ->
		unless @stopAnimation
			do @draw
			requestAnimationFrame @tick.bind @
		else
			setTimeout =>
				console.log 'stop'
				do @tick
			, 100

	logic: ->
		@logicTimer = setInterval =>
			do @update
		, 1000 / 60

	clean: ->
		@ctx.clearRect 0, 0, @scrSize.x, @scrSize.y


	update: ->

		notCollision = (o1) =>
			@objects.filter (o2) =>
				coll = @collision o1, o2
				if coll and o1 instanceof Enemy
					@objects[0].up()
				if coll and o1 instanceof Player
					@screen.removeEventListener 'click', o1.shoot
				# @screen.removeEventListener 'mousemove', o1.move
				coll
			.length == 0

		@objects = @objects.filter notCollision

		win = @objects.some (item) ->
			item instanceof Enemy

		lose = @objects.some (item) ->
			item instanceof Player

		unless win
			alert "Поздравляю!!! Вы победили Инопланетных Захватчиков! Но радары засекли еще одну волну! Нажми \"Ok\" чтобы разгромить врага!"
			do @addEnemies

		unless lose
			@stopAnimation = on
			# alert "К сожалению ваш корабль был разбить суровым натиском инопланетных захватчиков но ты успел эвакуироваться на базу где тебя ждет новый корабль! Нажми \"Ok\" чтобы дать отпор врагу еще раз!"
			@objects = []
			do @addObjects
			@stopAnimation = no


		@objects.forEach (item, i) =>
			if item.pos.y < 0 or item.pos.y >= @scrSize.y
				@objects.splice i, 1
			else
				do item.update if item.update


	draw: ->
		do @clean
		@objects.forEach (obj) =>
			if obj instanceof Score
				@ctx.fillStyle = "rgba(255, 255, 255, 1)"
				@ctx.font = obj.font
				@ctx.fillText obj.text, obj.pos.x, obj.pos.y

			@ctx.fillStyle = "rgba(0, 0, 0, 0)"
			@ctx.fillRect obj.pos.x, obj.pos.y, obj.size.width, obj.size.height
			if obj.icon then @ctx.drawImage @icons, obj.icon.x, obj.icon.y, obj.size.width, obj.size.height, obj.pos.x, obj.pos.y, obj.size.width, obj.size.height


	addEnemies: ->
		size = width: 29, height: 25
		x = 3
		y = 3
		for i in [0...8]
			if i == 0 then x = x
			else x += size.height + size.height / 3
			ind = 0
			for i in [0...5]
				ind++
				if i == 0 then y = y
				else y += size.width + size.width / 3
				pos = x: x, y: y
				@objects.push new Enemy @, pos, size, ind
			y = 3


	collision : (o1, o2) ->
		if o1 instanceof Score or o2 instanceof Score then return
		else !(o1 == o2 or
			o1.pos.x + o1.size.width < o2.pos.x or
			o1.pos.y + o1.size.height < o2.pos.y or
			o1.pos.x > o2.pos.x + o2.size.width or
			o1.pos.y > o2.pos.y + o2.size.height
		)

module.exports = InitGame