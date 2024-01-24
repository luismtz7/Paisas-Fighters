// main.js
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0}, // Desactivamos la gravedad en el eje Y
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);

function preload() {
    // Carga de imágenes y otros recursos
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 56 });
}

function create() {

    let backgroundImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background').setName('background');
    backgroundImage.setDisplaySize(window.innerWidth, window.innerHeight);

    // Creación de escenario y objetos
    player = this.physics.add.sprite(700, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.physics.add.collider(player, this.children.getByName('background'));

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 12 }),
        frameRate: 10,
        repeat: 1
    });


    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 13, end: 16 }),
        frameRate: 10,
        repeat: 1
    });

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
// Agregar movimiento del jugador con las teclas de flecha
    // Reiniciar velocidad del jugador
    player.setVelocity(0, 0);

    // Declarar variables para asignar movimiento son las teclas "W,A,S,D"
    let keyA;
    let keyS;
    let keyD;
    let keyW;

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if(keyA.isDown) {
        player.setVelocityX(-160)
     }
    if(keyS.isDown) {
        player.setVelocityY(160)
     }
    if(keyD.isDown) {
        player.setVelocityX(160)
     }
     if(keyW.isDown) {
        player.setVelocityY(-160)
     }


    // Verificar las teclas presionadas
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } 
    if (cursors.right.isDown) {
        player.setVelocityX(160);
    } 
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } 
    if (cursors.down.isDown) {
        player.setVelocityY(160);
    }

    // Determinar la animación basada en la velocidad
    if (player.body.velocity.x < 0) {
        player.anims.play('left', true);
    } else if (player.body.velocity.x > 0) {
        player.anims.play('right', true);
    } else if (player.body.velocity.y < 0) {
        player.anims.play('up', true);
    } else if (player.body.velocity.y > 0) {
        player.anims.play('down', true);
    } else {
        player.anims.play('turn', true);
    }

}
    
