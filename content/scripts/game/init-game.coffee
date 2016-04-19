'use strict'

Player = require "./player"
Enemy = require './enemy'

class InitGame
	constructor: (@screen) ->
		@ctx = @screen.getContext '2d'
		@scrSize = x: @screen.width, y: @screen.height
		@objects = []
		@icons = new Image
		@icons.src = './images/icons.png'


	start: ->
		@icons.onload = =>
			@objects.push new Player @
			do @addEnemies
			do @tick


	tick: ->
		do @update
		do @draw
		requestAnimationFrame @tick.bind @


	clean: ->
		@ctx.clearRect 0, 0, @scrSize.x, @scrSize.y


	update: ->

		notCollision = (o1) =>
			@objects.filter (o2) =>
				@collision o1, o2
			.length == 0

		@objects = @objects.filter notCollision

		win = @objects.some (item) ->
			item instanceof Enemy

		lose = @objects.some (item) ->
			item instanceof Player

		if not win
			alert "Поздравляю!!! Вы победили Инопланетных Захватчиков! Но радары засекли еще одну волну! Нажми \"Ok\" чтобы разгромить врага!"
			location.reload on
		if not lose
			alert "К сожалению ваш корабль был разбить суровым натиском инопланетных захватчиков но ты успел эвакуироваться на базу где тебя ждет новый корабль! Нажми \"Ok\" чтобы дать отпор врагу еще раз!"
			location.reload on

		@objects.forEach (item, i) =>
			if item.pos.y < 0 or item.pos.y >= @scrSize.y
				@objects.splice i, 1
			else
				do item.update if item.update


	draw: ->
		do @clean
		@objects.forEach (obj) =>
			@ctx.fillStyle = "rgba(0, 0, 0, 0)"
			@ctx.fillRect obj.pos.x, obj.pos.y, obj.size.width, obj.size.height
			@ctx.drawImage @icons, obj.icon.x, obj.icon.y, obj.size.width, obj.size.height, obj.pos.x, obj.pos.y, obj.size.width, obj.size.height


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
		!(o1 == o2 or
			o1.pos.x + o1.size.width < o2.pos.x or
			o1.pos.y + o1.size.height / 2 < o2.pos.y - o2.size.height / 2 or
			o1.pos.x > o2.pos.x + o2.size.width or
			o1.pos.y - o1.size.height / 2 > o2.pos.y + o2.size.height / 2
		)

module.exports = InitGame