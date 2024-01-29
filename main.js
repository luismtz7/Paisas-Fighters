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
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 94, frameHeight: 120 });
    // Carga de spritesheet del segundo jugador "playerTwo"
    this.load.spritesheet('playerTwo', 'assets/playerTwo.png', { frameWidth: 94, frameHeight: 120 });
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
    // Cambia las coordenadas iniciales del jugador
    player = this.physics.add.sprite(700, window.innerHeight - 120, 'player');

    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    // Establecer el tamaño de la hitbox del jugador
    player.setSize(94, 120);
    // Centrar la hitbox (opcional, depende del tamaño de tu sprite)
    player.setOffset(0, 0);

    // Agregar colisionador con el suelo
    this.physics.add.collider(player, this.children.getByName('background'));

    // Creación del segundo jugador
    playerTwo = this.physics.add.sprite(800, 300, 'playerTwo');
    playerTwo.setCollideWorldBounds(true);
    playerTwo.setBounce(0.2);

    // Establecer el tamaño de la hitbox del segundo jugador
    playerTwo.setSize(94, 120);
    // Centrar la hitbox (opcional, depende del tamaño de tu sprite)
    playerTwo.setOffset(0, 0);

    // Agregar colisionador con el suelo
    this.physics.add.collider(player, this.children.getByName('background'));
    this.physics.add.collider(playerTwo, this.children.getByName('background'));


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 7 }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 13 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attack',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'attackRight',
        frames: [{ key: 'player', frame: 14 }],
        frameRate: 10,
        repeat: 0
    });


    cursors = this.input.keyboard.createCursorKeys();

    healthBar = this.add.graphics();
    updateHealthBar();

    this.anims.create({
        key: 'leftPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turnPlayerTwo',
        frames: [{ key: 'playerTwo', frame: 7 }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'rightPlayerTwo',
        frames: this.anims.generateFrameNumbers('playerTwo', { start: 9, end: 13 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attackPlayerTwo',
        frames: [{ key: 'playerTwo', frame: 0 }],
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'attackPlayerTwoRight',
        frames: [{ key: 'playerTwo', frame: 14 }],
        frameRate: 10,
        repeat: 0
    });

    cursorsPlayerTwo = this.input.keyboard.createCursorKeys();

    //Ataque
    attackKeyPlayer = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    attackKeyPlayerRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    attackKeyPlayerTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    attackKeyPlayerTwoRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
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
        player.setVelocityX(-260);
    }
    if (keyS.isDown) {
        player.setVelocityY(260);
    }
    if (keyD.isDown) {
        player.setVelocityX(260);
    }
    if (keyW.isDown) {
        player.setVelocityY(-260);
    }

    // Verificar las teclas presionadas para el segundo jugador
    if (cursorsPlayerTwo.left.isDown) {
        playerTwo.setVelocityX(-260);
    }
    if (cursorsPlayerTwo.right.isDown) {
        playerTwo.setVelocityX(260);
    }
    if (cursorsPlayerTwo.up.isDown) {
        playerTwo.setVelocityY(-260);
    }
    if (cursorsPlayerTwo.down.isDown) {
        playerTwo.setVelocityY(260);
    }

    // Determinar la animación basada en la velocidad
    if (player.body.velocity.x < 0) {
        player.anims.play('left', true);
    } else if (player.body.velocity.x > 0) {
        player.anims.play('right', true);
    } else {
        player.anims.play('turn', true);
    }

    // Determinar la animación basada en la velocidad para el segundo jugador
    if (playerTwo.body.velocity.x < 0) {
        playerTwo.anims.play('leftPlayerTwo', true);
    } else if (playerTwo.body.velocity.x > 0) {
        playerTwo.anims.play('rightPlayerTwo', true);
    } else {
        playerTwo.anims.play('turnPlayerTwo', true);
    }

     // Lógica de ataque para el jugador uno Left
     if (attackKeyPlayerRight.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        player.anims.play('attackRight', true);
        
        // Establecer el frame de golpe durante 1 segundo
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            player.anims.play('turn', true);
        });

        // Verificar si el jugador dos está en rango de ataque
        if (Phaser.Math.Distance.Between(player.x, player.y, playerTwo.x, playerTwo.y) < 20) {
            // Aplicar daño al jugador dos después de 1 segundo
            this.time.delayedCall(250, () => {
                playerTwoHealth = Math.max(playerTwoHealth - 10, 0); // Evitar que la salud sea negativa
                updateHealthBar();
            });
        }
    }

    // Lógica de ataque para el jugador uno Right
    if (attackKeyPlayer.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        player.anims.play('attack', true);
        
        // Establecer el frame de golpe durante 1 segundo
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            player.anims.play('turn', true);
        });

        // Verificar si el jugador dos está en rango de ataque
        if (Phaser.Math.Distance.Between(player.x, player.y, playerTwo.x, playerTwo.y) < 20) {
            // Aplicar daño al jugador dos después de 1 segundo
            this.time.delayedCall(250, () => {
                playerTwoHealth = Math.max(playerTwoHealth - 10, 0); // Evitar que la salud sea negativa
                updateHealthBar();
            });
        }
    }

    //Lógica de ataque del jugado dos Left
    if (attackKeyPlayerTwo.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        playerTwo.anims.play('attackPlayerTwo', true);
        
        // Establecer el frame de golpe durante 1 segundo
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            playerTwo.anims.play('turnPlayerTwo', true);
        });

        // Verificar si el jugador uno está en rango de ataque
        if (Phaser.Math.Distance.Between(playerTwo.x, playerTwo.y, player.x, player.y) < 20) {
            // Aplicar daño al jugador dos después de 1 segundo
            this.time.delayedCall(250, () => {
                playerHealth = Math.max(playerHealth - 10, 0); // Evitar que la salud sea negativa
                updateHealthBar();
            });
        }
    }

    //Lógica de atauqe de jugador dos Right
    if (attackKeyPlayerTwoRight.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        playerTwo.anims.play('attackPlayerTwoRight', true);
        
        // Establecer el frame de golpe durante 1 segundo
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            playerTwo.anims.play('turnPlayerTwo', true);
        });

        // Verificar si el jugador uno está en rango de ataque
        if (Phaser.Math.Distance.Between(playerTwo.x, playerTwo.y, player.x, player.y) < 20) {
            // Aplicar daño al jugador dos después de 1 segundo
            this.time.delayedCall(250, () => {
                playerHealth = Math.max(playerHealth - 10, 0); // Evitar que la salud sea negativa
                updateHealthBar();
            });
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
    }
}
