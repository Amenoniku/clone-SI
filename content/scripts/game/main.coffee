'use strict'

Game = require "./init-game"

gameScreen = document.getElementById 'game'
game = new Game gameScreen

do game.start