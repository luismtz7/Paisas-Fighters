// main.js
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 90000 },
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
    // Carga de spritesheet del segundo jugador "playerTwo"
    this.load.spritesheet('playerTwo', 'assets/playerTwo.png', { frameWidth: 32, frameHeight: 56 });
}

let playerHealth = 100;
let playerTwoHealth = 100;
let healthBar;
let cursors;
let cursorsPlayerTwo;

// Lógica de ataque
let attackKeyPlayer;
let attackKeyPlayerTwo;
let isAttackingPlayer = false;
let isAttackingPlayerTwo = false;

function create() {

    let backgroundImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background').setName('background');
    backgroundImage.setDisplaySize(window.innerWidth, window.innerHeight);

    // Creación de escenario y objetos
    player = this.physics.add.sprite(700, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

     // Establecer el tamaño de la hitbox del jugador
     player.setSize(32, 56);
     // Centrar la hitbox (opcional, depende del tamaño de tu sprite)
     player.setOffset(0, 0);

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

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('player', { start: 13, end: 16 }),
        frameRate: 10,
        repeat: 0, // No se repite la animación
    });

    cursors = this.input.keyboard.createCursorKeys();

    healthBar = this.add.graphics();
    updateHealthBar();

    // Creación del segundo jugador
    playerTwo = this.physics.add.sprite(800, 300, 'playerTwo');
    playerTwo.setCollideWorldBounds(true);
    playerTwo.setBounce(0.2);

    // Establecer el tamaño de la hitbox del segundo jugador
    playerTwo.setSize(32, 56);
    // Centrar la hitbox (opcional, depende del tamaño de tu sprite)
    playerTwo.setOffset(0, 0);

    this.physics.add.collider(playerTwo, this.children.getByName('background'));

    this.anims.create({
        key: 'leftPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turnPlayerTwo',
        frames: [{ key: 'playerTwo', frame: 4 }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'rightPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'upPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 9, end: 12 }),
        frameRate: 10,
        repeat: 1
    });

    this.anims.create({
        key: 'downPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 13, end: 16 }),
        frameRate: 10,
        repeat: 1
    });

    this.anims.create({
        key: 'attackPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 13, end: 16 }),
        frameRate: 10,
        repeat: 0, // No se repite la animación
    });

    cursorsPlayerTwo = this.input.keyboard.createCursorKeys();

    //Ataque
    attackKeyPlayer = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    attackKeyPlayerTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
}

function update() {
    // Agregar movimiento del jugador con las teclas de flecha
    // Reiniciar velocidad del jugador
    player.setVelocity(0, 0);
    // Reiniciar velocidad del segundo jugador
    playerTwo.setVelocity(0, 0);

    // Declarar variables para asignar movimiento son las teclas "W,A,S,D"
    let keyA;
    let keyS;
    let keyD;
    let keyW;

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (keyA.isDown) {
        player.setVelocityX(-160);
    }
    if (keyS.isDown) {
        player.setVelocityY(160);
    }
    if (keyD.isDown) {
        player.setVelocityX(160);
    }
    if (keyW.isDown) {
        player.setVelocityY(-160);
    }

    // Verificar las teclas presionadas para el segundo jugador
    if (cursorsPlayerTwo.left.isDown) {
        playerTwo.setVelocityX(-160);
    }
    if (cursorsPlayerTwo.right.isDown) {
        playerTwo.setVelocityX(160);
    }
    if (cursorsPlayerTwo.up.isDown) {
        playerTwo.setVelocityY(-160);
    }
    if (cursorsPlayerTwo.down.isDown) {
        playerTwo.setVelocityY(160);
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

    // Determinar la animación basada en la velocidad para el segundo jugador
    if (playerTwo.body.velocity.x < 0) {
        playerTwo.anims.play('leftPlayerTwo', true);
    } else if (playerTwo.body.velocity.x > 0) {
        playerTwo.anims.play('rightPlayerTwo', true);
    } else if (playerTwo.body.velocity.y < 0) {
        playerTwo.anims.play('upPlayerTwo', true);
    } else if (playerTwo.body.velocity.y > 0) {
        playerTwo.anims.play('downPlayerTwo', true);
    } else {
        playerTwo.anims.play('turnPlayerTwo', true);
    }

    if (attackKeyPlayer.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        player.anims.play('attack', true);
        this.time.delayedCall(300, () => {
            isAttackingPlayer = false;
            player.anims.play('turn', true);
        });

        // Verificar si el jugador dos está en rango de ataque
        if (Phaser.Math.Distance.Between(player.x, player.y, playerTwo.x, playerTwo.y) < 20) {
            // Aplicar daño al jugador dos
            playerTwoHealth -= 10;
            updateHealthBar();
        }
    }

     // Lógica de ataque para el jugador uno
     if (attackKeyPlayer.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        player.anims.play('attack', true);
        this.time.delayedCall(300, () => {
            isAttackingPlayer = false;
            player.anims.play('turn', true);
        });

        // Verificar si el jugador dos está en rango de ataque
        if (Phaser.Math.Distance.Between(player.x, player.y, playerTwo.x, playerTwo.y) < 20) {
            // Aplicar daño al jugador dos
            playerTwoHealth = Math.max(playerTwoHealth - 10, 0); // Evitar que la salud sea negativa
            updateHealthBar();
        }
    }

    // Lógica de ataque para el jugador dos
    if (attackKeyPlayerTwo.isDown && !isAttackingPlayerTwo) {
        isAttackingPlayerTwo = true;
        playerTwo.anims.play('attackPlayerTwo', true);
        this.time.delayedCall(300, () => {
            isAttackingPlayerTwo = false;
            playerTwo.anims.play('turnPlayerTwo', true);
        });

        // Verificar si el jugador uno está en rango de ataque
        if (Phaser.Math.Distance.Between(playerTwo.x, playerTwo.y, player.x, player.y) < 20) {
            // Aplicar daño al jugador uno
            playerHealth = Math.max(playerHealth - 10, 0); // Evitar que la salud sea negativa
            updateHealthBar();
        }
    }
}

function updateHealthBar() {
    healthBar.clear();

    // Configuración del diseño de las barras de vida
    const barWidth = (window.innerWidth - 40 - 100) / 2; // Ancho de cada barra (restando los márgenes y la separación en el medio)
    const barHeight = 20; // Altura de las barras
    const margin = 20; // Márgenes laterales
    const separation = 100; // Separación entre las barras

    // Barra de vida para el jugador uno
    const playerBarX = margin;
    const playerBarY = 20;

    // Color del borde para el jugador uno
    healthBar.fillStyle(0x000000, 1); // Color negro
    healthBar.fillRect(playerBarX - 2, playerBarY - 2, barWidth + 4, barHeight + 4); // Ajustar el tamaño para incluir el borde

    // Color de relleno para el jugador uno
    healthBar.fillStyle(0x39EF00, 1); // Color verde
    healthBar.fillRect(playerBarX, playerBarY, (playerHealth / 100) * barWidth, barHeight); // Ancho proporcional a los puntos de vida

    // Barra de vida para el jugador dos
    const playerTwoBarX = window.innerWidth - margin - barWidth;
    const playerTwoBarY = 20;

    // Color del borde para el jugador dos
    healthBar.fillStyle(0x000000, 1); // Color negro
    healthBar.fillRect(playerTwoBarX - 2, playerTwoBarY - 2, barWidth + 4, barHeight + 4); // Ajustar el tamaño para incluir el borde

    // Asegurarse de que la barra de vida del jugador dos no sea menor que cero
    const playerTwoBarWidth = Math.max((playerTwoHealth / 100) * barWidth, 0);

    // Color de relleno para el jugador dos
    healthBar.fillStyle(0x39EF00, 1); // Color verde
    healthBar.fillRect(playerTwoBarX, playerTwoBarY, playerTwoBarWidth, barHeight); // Ancho proporcional a los puntos de vida del jugador dos

    if (playerHealth <= 0 || playerTwoHealth <= 0) {
        // Muestra un alert de Game Over
        alert("Game Over");

        // Puedes agregar más lógica aquí, como reiniciar el juego
        // o redirigir a otra página, según tus necesidades.
    }
}
