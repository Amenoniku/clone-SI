(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
require('./game/main');


},{"./game/main":5}],2:[function(require,module,exports){
'use strict';
var Bullet;

Bullet = (function() {
  function Bullet(pos, gravity, where) {
    var iconEnemyBullet, iconPlayerBullet;
    this.pos = pos;
    this.gravity = gravity;
    this.size = {
      width: 3,
      height: 6
    };
    iconEnemyBullet = {
      x: 152,
      y: 65
    };
    iconPlayerBullet = {
      x: 157,
      y: 65
    };
    if (where === "Player") {
      this.icon = iconPlayerBullet;
    }
    if (where === "Enemy") {
      this.icon = iconEnemyBullet;
    }
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
    var icon, randomIcons;
    this.data = data;
    this.pos = pos;
    this.size = size;
    this.ind = ind;
    this.moveX = 0;
    this.speed = 1;
    randomIcons = [
      icon = {
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
    this.icon = randomIcons[Math.floor(Math.random() * randomIcons.length)];
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
        y: this.pos.y + this.size.height / 2 + this.size.height / 2 + 1
      };
      bullet = new Bullet(bulletCoors, {
        speed: 3,
        dir: true
      }, 'Enemy');
      return this.data.objects.push(bullet);
    }
  };

  return Enemy;

})();

module.exports = Enemy;


},{"./bullet":2}],4:[function(require,module,exports){
'use strict';
var Bullet, Enemy, InitGame, Player, Score;

Player = require("./player");

Enemy = require('./enemy');

Score = require("./score");

Bullet = require("./bullet");

InitGame = (function() {
  function InitGame(screen) {
    this.screen = screen;
    this.ctx = this.screen.getContext('2d');
    this.scrSize = {
      x: this.screen.width,
      y: this.screen.height
    };
    this.objects = [];
    this.stopAnimation = false;
    this.logicTimer = false;
    this.icons = new Image;
    this.icons.src = './images/icons.png';
  }

  InitGame.prototype.start = function() {
    return this.icons.onload = (function(_this) {
      return function() {
        _this.addObjects();
        _this.tick();
        return _this.logic();
      };
    })(this);
  };

  InitGame.prototype.addObjects = function() {
    this.objects.push(new Score(this));
    this.objects.push(new Player(this));
    return this.addEnemies();
  };

  InitGame.prototype.tick = function() {
    if (!this.stopAnimation) {
      this.draw();
      return requestAnimationFrame(this.tick.bind(this));
    } else {
      return setTimeout((function(_this) {
        return function() {
          console.log('stop');
          return _this.tick();
        };
      })(this), 100);
    }
  };

  InitGame.prototype.logic = function() {
    return this.logicTimer = setInterval((function(_this) {
      return function() {
        return _this.update();
      };
    })(this), 1000 / 60);
  };

  InitGame.prototype.clean = function() {
    return this.ctx.clearRect(0, 0, this.scrSize.x, this.scrSize.y);
  };

  InitGame.prototype.update = function() {
    var lose, notCollision, win;
    notCollision = (function(_this) {
      return function(o1) {
        return _this.objects.filter(function(o2) {
          var coll;
          coll = _this.collision(o1, o2);
          if (coll && o1 instanceof Enemy) {
            _this.objects[0].up();
          }
          if (coll && o1 instanceof Player) {
            _this.screen.removeEventListener('click', o1.shoot);
          }
          return coll;
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
      this.addEnemies();
    }
    if (!lose) {
      this.stopAnimation = true;
      this.objects = [];
      this.addObjects();
      this.stopAnimation = false;
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
        if (obj instanceof Score) {
          _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
          _this.ctx.font = obj.font;
          _this.ctx.fillText(obj.text, obj.pos.x, obj.pos.y);
        }
        _this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
        _this.ctx.fillRect(obj.pos.x, obj.pos.y, obj.size.width, obj.size.height);
        if (obj.icon) {
          return _this.ctx.drawImage(_this.icons, obj.icon.x, obj.icon.y, obj.size.width, obj.size.height, obj.pos.x, obj.pos.y, obj.size.width, obj.size.height);
        }
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
    if (o1 instanceof Score || o2 instanceof Score) {

    } else {
      return !(o1 === o2 || o1.pos.x + o1.size.width < o2.pos.x || o1.pos.y + o1.size.height < o2.pos.y || o1.pos.x > o2.pos.x + o2.size.width || o1.pos.y > o2.pos.y + o2.size.height);
    }
  };

  return InitGame;

})();

module.exports = InitGame;


},{"./bullet":2,"./enemy":3,"./player":6,"./score":7}],5:[function(require,module,exports){
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
    this.move = bind(this.move, this);
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
    this.data.screen.addEventListener("mousemove", this.move);
    this.data.screen.addEventListener("click", this.shoot);
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
    }, 'Player');
    return this.data.objects.push(bullet);
  };

  Player.prototype.move = function(event) {
    return this.x = event.offsetX - this.size.width / 2;
  };

  return Player;

})();

module.exports = Player;


},{"./bullet":2}],7:[function(require,module,exports){
'use strict';
var Score;

Score = (function() {
  function Score(data) {
    this.score = 0;
    this.size = {
      width: 28,
      height: 12
    };
    this.pos = {
      x: 0,
      y: data.scrSize.y - this.size.height + 9
    };
    this.font = "bold " + this.size.height + "px Arial";
    this.text = "Score: " + this.score;
  }

  Score.prototype.up = function() {
    return this.text = "Score: " + (++this.score);
  };

  return Score;

})();

module.exports = Score;


},{}]},{},[1]);
