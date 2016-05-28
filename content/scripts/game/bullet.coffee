'use strict'

class Bullet
	constructor: (@pos, @gravity, where) ->
		@size = width: 3, height: 6
		iconEnemyBullet = x: 152, y: 65
		iconPlayerBullet = x: 157, y: 65
		if where == "Player" then @icon = iconPlayerBullet
		if where == "Enemy" then @icon = iconEnemyBullet

	update: ->
		unless @gravity.dir then @pos.y -= @gravity.speed
		else @pos.y += @gravity.speed

module.exports = Bullet