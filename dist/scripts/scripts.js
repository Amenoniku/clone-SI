(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
require('./game/main');


},{"./game/main":5}],2:[function(require,module,exports){
'use strict';
var Bullet;

Bullet = (function() {
  function Bullet(pos, gravity) {
    this.pos = pos;
    this.gravity = gravity;
    this.size = {
      width: 3,
      height: 6
    };
    this.icon = {
      x: 152,
      y: 65
    };
  }

  Bullet.prototype.update = function() {
    if (!this.gravity.dir) {
      return this.pos.y -= this.gravity.speed;
    } else {
      return this.pos.y += this.gravity.speed;
    }
  };

  return Bullet;

})();

module.exports = Bullet;


},{}],3:[function(require,module,exports){
'use strict';
var Bullet, Enemy;

Bullet = require("./bullet");

Enemy = (function() {
  function Enemy(data, pos, size, ind) {
    var icon, length, randomIcons;
    this.data = data;
    this.pos = pos;
    this.size = size;
    this.ind = ind;
    this.moveX = 0;
    this.speed = 1;
    randomIcons = [
      icon = {
        x: 9,
        y: 0
      }, icon = {
        x: 57,
        y: 0
      }, icon = {
        x: 98.5,
        y: 0
      }, icon = {
        x: 139,
        y: 0
      }, icon = {
        x: 9,
        y: 30
      }, icon = {
        x: 57,
        y: 30
      }, icon = {
        x: 98.5,
        y: 30
      }, icon = {
        x: 139,
        y: 30
      }
    ];
    length = Math.floor(Math.random() * randomIcons.length);
    this.icon = randomIcons[length];
  }

  Enemy.prototype.update = function() {
    if (this.moveX < 0 || this.moveX > this.data.scrSize.x / 3) {
      this.speed = -this.speed;
    }
    this.pos.x += this.speed;
    this.moveX += this.speed;
    return this.shoot();
  };

  Enemy.prototype.isLower = function(enemy) {
    return this.data.objects.filter(function(o) {
      return o instanceof Enemy && o.pos.y > enemy.pos.y && o.pos.x - enemy.pos.x < enemy.size.width;
    }).length > 0;
  };

  Enemy.prototype.shoot = function() {
    var bullet, bulletCoors;
    if (Math.random() < 0.04 && !this.isLower(this)) {
      bulletCoors = {
        x: this.pos.x + this.size.width / 2,
        y: this.pos.y + this.size.height / 2 + this.size.height / 2
      };
      bullet = new Bullet(bulletCoors, {
        speed: 3,
        dir: true
      });
      return this.data.objects.push(bullet);
    }
  };

  return Enemy;

})();

module.exports = Enemy;


},{"./bullet":2}],4:[function(require,module,exports){
'use strict';
var Enemy, InitGame, Player;

Player = require("./player");

Enemy = require('./enemy');

InitGame = (function() {
  function InitGame(screen) {
    this.screen = screen;
    this.ctx = this.screen.getContext('2d');
    this.scrSize = {
      x: this.screen.width,
      y: this.screen.height
    };
    this.objects = [];
    this.icons = new Image;
    this.icons.src = './images/icons.png';
  }

  InitGame.prototype.start = function() {
    return this.icons.onload = (function(_this) {
      return function() {
        _this.objects.push(new Player(_this));
        _this.addEnemies();
        return _this.tick();
      };
    })(this);
  };

  InitGame.prototype.tick = function() {
    this.update();
    this.draw();
    return requestAnimationFrame(this.tick.bind(this));
  };

  InitGame.prototype.clean = function() {
    return this.ctx.clearRect(0, 0, this.scrSize.x, this.scrSize.y);
  };

  InitGame.prototype.update = function() {
    var lose, notCollision, win;
    notCollision = (function(_this) {
      return function(o1) {
        return _this.objects.filter(function(o2) {
          return _this.collision(o1, o2);
        }).length === 0;
      };
    })(this);
    this.objects = this.objects.filter(notCollision);
    win = this.objects.some(function(item) {
      return item instanceof Enemy;
    });
    lose = this.objects.some(function(item) {
      return item instanceof Player;
    });
    if (!win) {
      alert("Поздравляю!!! Вы победили Инопланетных Захватчиков! Но радары засекли еще одну волну! Нажми \"Ok\" чтобы разгромить врага!");
      location.reload(true);
    }
    if (!lose) {
      alert("К сожалению ваш корабль был разбить суровым натиском инопланетных захватчиков но ты успел эвакуироваться на базу где тебя ждет новый корабль! Нажми \"Ok\" чтобы дать отпор врагу еще раз!");
      location.reload(true);
    }
    return this.objects.forEach((function(_this) {
      return function(item, i) {
        if (item.pos.y < 0 || item.pos.y >= _this.scrSize.y) {
          return _this.objects.splice(i, 1);
        } else {
          if (item.update) {
            return item.update();
          }
        }
      };
    })(this));
  };

  InitGame.prototype.draw = function() {
    this.clean();
    return this.objects.forEach((function(_this) {
      return function(obj) {
        _this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
        _this.ctx.fillRect(obj.pos.x, obj.pos.y, obj.size.width, obj.size.height);
        return _this.ctx.drawImage(_this.icons, obj.icon.x, obj.icon.y, obj.size.width, obj.size.height, obj.pos.x, obj.pos.y, obj.size.width, obj.size.height);
      };
    })(this));
  };

  InitGame.prototype.addEnemies = function() {
    var i, ind, j, k, pos, results, size, x, y;
    size = {
      width: 29,
      height: 25
    };
    x = 3;
    y = 3;
    results = [];
    for (i = j = 0; j < 8; i = ++j) {
      if (i === 0) {
        x = x;
      } else {
        x += size.height + size.height / 3;
      }
      ind = 0;
      for (i = k = 0; k < 5; i = ++k) {
        ind++;
        if (i === 0) {
          y = y;
        } else {
          y += size.width + size.width / 3;
        }
        pos = {
          x: x,
          y: y
        };
        this.objects.push(new Enemy(this, pos, size, ind));
      }
      results.push(y = 3);
    }
    return results;
  };

  InitGame.prototype.collision = function(o1, o2) {
    return !(o1 === o2 || o1.pos.x + o1.size.width < o2.pos.x || o1.pos.y + o1.size.height / 2 < o2.pos.y - o2.size.height / 2 || o1.pos.x > o2.pos.x + o2.size.width || o1.pos.y - o1.size.height / 2 > o2.pos.y + o2.size.height / 2);
  };

  return InitGame;

})();

module.exports = InitGame;


},{"./enemy":3,"./player":6}],5:[function(require,module,exports){
'use strict';
var Game, game, gameScreen;

Game = require("./init-game");

gameScreen = document.getElementById('game');

game = new Game(gameScreen);

game.start();


},{"./init-game":4}],6:[function(require,module,exports){
'use strict';
var Bullet, Player,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Bullet = require("./bullet");

Player = (function() {
  function Player(data) {
    this.data = data;
    this.shoot = bind(this.shoot, this);
    this.screenWidth = this.data.scrSize.x - 40;
    this.size = {
      width: 28,
      height: 12
    };
    this.pos = {
      x: (this.data.scrSize.x / 2) - (this.size.width / 2),
      y: this.data.scrSize.y - 30
    };
    this.icon = {
      x: 138.5,
      y: 75
    };
    this.x = this.pos.x;
    this.conrtoller();
  }

  Player.prototype.update = function() {
    if (this.x < 10) {
      this.x = 10;
    }
    if (this.x > this.screenWidth) {
      this.x = this.screenWidth;
    }
    return this.pos.x = this.x;
  };

  Player.prototype.shoot = function(event) {
    var bullet;
    event.preventDefault();
    bullet = new Bullet({
      x: this.pos.x + this.size.width / 2,
      y: this.pos.y - 12
    }, {
      speed: 4,
      dir: false
    });
    return this.data.objects.push(bullet);
  };

  Player.prototype.conrtoller = function() {
    this.data.screen.addEventListener("mousemove", (function(_this) {
      return function(e) {
        return _this.x = e.offsetX - _this.size.width / 2;
      };
    })(this));
    return this.data.screen.addEventListener("click", this.shoot);
  };

  return Player;

})();

module.exports = Player;


},{"./bullet":2}]},{},[1]);
