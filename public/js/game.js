window.onload = function() {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
  });
  var socket = io('http://192.168.1.192:3000');
  socket.emit('join');
  socket.on('joined', function(data) {
    console.log(data);
  });

  function preload() {
    game.load.spritesheet('dude', '/images/dude.png', 32, 48);
    game.load.image('star', '/images/star.png');
    game.load.image('sky', '/images/sky.png');
    game.load.image('ground', '/images/platform.png');
  }

  var platforms;
  var player;
  var cursors;

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.enableBody = true;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
  }

  function update() {
    game.physics.arcade.collide(player, platforms);

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else {
      player.body.velocity.x = 0;
      player.animations.stop;
      player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -350;
    }
  }
}

