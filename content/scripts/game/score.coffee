'use strict'

class Score
	constructor: (data) ->
		@score = 0
		@size = width: 28, height: 12
		@pos = x: 0, y: data.scrSize.y - @size.height + 9
		@font = "bold #{@size.height}px Arial"
		@text = "Score: #{@score}"

	up: ->
		@text = "Score: #{++@score}"


module.exports = Score