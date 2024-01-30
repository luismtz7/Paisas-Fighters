// main.js
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1100 },
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
    // Creación del primer jugador
    player = this.physics.add.sprite(500, 600, 'player');

    player.setCollideWorldBounds(true);

    // Establecer el tamaño de la hitbox del jugador
    player.setSize(75, 120);
    // Centrar la hitbox 
    player.setOffset(0, 0);

    // Creación del segundo jugador
    playerTwo = this.physics.add.sprite(800, 600, 'playerTwo');
    playerTwo.setCollideWorldBounds(true);

    // Establecer el tamaño de la hitbox del segundo jugador
    playerTwo.setSize(75, 120);
    // Centrar la hitbox
    playerTwo.setOffset(0, 0);

    // Agregar colisionador con el suelo
    this.physics.add.collider(player, this.children.getByName('background'));
    this.physics.add.collider(playerTwo, this.children.getByName('background'));

    // Colisión entre jugadores
    this.physics.add.collider(player, playerTwo);


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 13 }),
        frameRate: 10,
        repeat: -1
    });

     // Crear un fotograma estático para el jugador mirando a la izquierda
     this.anims.create({
        key: 'idleLeft',
        frames: [{ key: 'player', frame: 6 }],
        frameRate: 1,
    });

    // Crear un fotograma estático para el jugador mirando a la derecha
    this.anims.create({
        key: 'idleRight',
        frames: [{ key: 'player', frame: 8 }],
        frameRate: 1,
    });

    // Crear un fotograma estático para el jugador mirando hacia adelante
    this.anims.create({
        key: 'idleFront',
        frames: [{ key: 'player', frame: 7 }],
        frameRate: 1,
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

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'playerTwo', frame: 7 }],
        frameRate: 20,
    });

    // Configuración de animación del segundo jugador
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

     // Crear un fotograma estático para el jugador mirando a la izquierda
     this.anims.create({
        key: 'idleLeftPlayerTwo',
        frames: [{ key: 'playerTwo', frame: 6 }],
        frameRate: 1,
    });

    // Crear un fotograma estático para el jugador mirando a la derecha
    this.anims.create({
        key: 'idleRightPlayerTwo',
        frames: [{ key: 'playerTwo', frame: 8 }],
        frameRate: 1,
    });

    // Crear un fotograma estático para el jugador mirando hacia adelante
    this.anims.create({
        key: 'idleFrontPlayerTwo',
        frames: [{ key: 'playerTwo', frame: 7 }],
        frameRate: 1,
    });

    cursors = this.input.keyboard.createCursorKeys();
    cursorsPlayerTwo = this.input.keyboard.createCursorKeys();

    //Ataque
    attackKeyPlayer = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    attackKeyPlayerRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    attackKeyPlayerTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    attackKeyPlayerTwoRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
}

let isPlayerOnGround = true;
let isPlayerTwoOnGround = true;
let jumpVelocity = -800; // Ajusta la velocidad de salto
const gravity = 1200; // Ajusta la gravedad
const jumpCooldown = 800; // Tiempo en milisegundos para evitar saltos múltiples

let lastKeyPressed;
let lastKeyPressedPlayerTwo;


function update() {
    // Agregar movimiento del jugador con las teclas
    // Reiniciar velocidad del jugador
    player.setVelocity(0, player.body.velocity.y);
    // Reiniciar velocidad del segundo jugador
    playerTwo.setVelocity(0, playerTwo.body.velocity.y);

    // Declarar variables para asignar movimiento son las teclas "W,A,S,D"
    let keyA;
    let keyS;
    let keyD;
    let keyW;

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);


    // Verificar las teclas presionadas para el primer jugador
    if (keyA.isDown) {
        player.setVelocityX(-260);
        lastKeyPressed = 'A';
    } else if (keyD.isDown) {
        player.setVelocityX(260);
        lastKeyPressed = 'D';
    } else if (keyS.isDown) {
        player.setVelocityY(260);
        lastKeyPressed = 'S';
    } else {
        player.setVelocityX(0);
    }

    // Determinar la animación basada en la velocidad y la última tecla presionada
    if (player.body.velocity.x < 0) {
        player.anims.play('left', true);
    } else if (player.body.velocity.x > 0) {
        player.anims.play('right', true);
    } else {
        // Usar la última tecla presionada para determinar el fotograma estático
        switch (lastKeyPressed) {
            case 'A':
                player.anims.play('idleLeft', true);
                break;
            case 'D':
                player.anims.play('idleRight', true);
                break;
            case 'S':
                player.anims.play('idleFront', true);
                break;
            default:
                player.anims.play('turn', true);
        }
    }

    // Lógica de salto
    if (keyW.isDown && isPlayerOnGround) {
        // Solo permitir saltos si el jugador está en el suelo y ha pasado el tiempo de cooldown
        player.setVelocityY(jumpVelocity);
        isPlayerOnGround = false; // Marcar al jugador como no estando en el suelo
        this.time.delayedCall(jumpCooldown, () => {
            isPlayerOnGround = true;
        });
    }
    
    // Aplicar gravedad al salto
    if (!isPlayerOnGround) {
        player.setAccelerationY(gravity);
    } else {
        player.setAccelerationY(0); // Si está en el suelo, no aplicar gravedad
    }

    // Verificar las teclas presionadas para el segundo jugador
    if (cursorsPlayerTwo.left.isDown) {
        playerTwo.setVelocityX(-260);
        lastKeyPressedPlayerTwo = 1;
    } else if (cursorsPlayerTwo.right.isDown) {
        playerTwo.setVelocityX(260);
        lastKeyPressedPlayerTwo = 2;
    } else if (cursorsPlayerTwo.down.isDown) {
        playerTwo.setVelocityY(260);
        lastKeyPressedPlayerTwo = 3;
    } else {
        playerTwo.setVelocityX(0);
    }

    // Determinar la animación basada en la velocidad y la última tecla presionada
    if (playerTwo.body.velocity.x < 0) {
        playerTwo.anims.play('leftPlayerTwo', true);
    } else if (playerTwo.body.velocity.x > 0) {
        playerTwo.anims.play('rightPlayerTwo', true);
    } else if (cursorsPlayerTwo.down.isDown) {
        playerTwo.anims.play('idleFrontPlayerTwo', true);
    } else {
        // Usar la última tecla presionada para determinar el fotograma estático
        switch (lastKeyPressedPlayerTwo) {
            case 1:
                playerTwo.anims.play('idleLeftPlayerTwo', true);
                break;
            case 2:
                playerTwo.anims.play('idleRightPlayerTwo', true);
                break;
            case 3:
                playerTwo.anims.play('idleFrontPlayerTwo', true);
                break;
            default:
                playerTwo.anims.play('turnPlayerTwo', true);
        }
    }



    // Lógica del salto para judador dos
    if (cursorsPlayerTwo.up.isDown && isPlayerTwoOnGround) {
        playerTwo.setVelocityY(jumpVelocity);
        isPlayerTwoOnGround = false;
        this.time.delayedCall(jumpCooldown, () => {
            isPlayerTwoOnGround = true;
        })
    }

    if (!isPlayerTwoOnGround){
        playerTwo.setAccelerationY(gravity);
    } else {
        playerTwo.setAccelerationY(0);
    }

     // Lógica de ataque para el jugador uno Left
    if (attackKeyPlayerRight.isDown && !isAttackingPlayer) {
        isAttackingPlayer = true;
        player.anims.play('attackRight', true);
        
        // Establecer el frame de golpe durante 250 milisegundos
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            player.anims.play('turn', true);
        });

        // Verificar si el jugador dos está en rango de ataque
        if (Phaser.Math.Distance.Between(player.x, player.y, playerTwo.x, playerTwo.y) < 100) {
            // Aplicar daño al jugador dos después de 250 milisegundos
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
        
        // Establecer el frame de golpe durante 250 milisegundos
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            player.anims.play('turn', true);
        });

        // Verificar si el jugador dos está en rango de ataque
        if (Phaser.Math.Distance.Between(player.x, player.y, playerTwo.x, playerTwo.y) < 100) {
            // Aplicar daño al jugador dos después de 250 milisegundos
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
        
        // Establecer el frame de golpe durante 250 milisegundos
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            playerTwo.anims.play('turnPlayerTwo', true);
        });

        // Verificar si el jugador uno está en rango de ataque
        if (Phaser.Math.Distance.Between(playerTwo.x, playerTwo.y, player.x, player.y) < 100) {
            // Aplicar daño al jugador dos después de 250 milisegundos
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
        
        // Establecer el frame de golpe durante 250 milisegundos
        this.time.delayedCall(250, () => {
            isAttackingPlayer = false;
            playerTwo.anims.play('turnPlayerTwo', true);
        });

        // Verificar si el jugador uno está en rango de ataque
        if (Phaser.Math.Distance.Between(playerTwo.x, playerTwo.y, player.x, player.y) < 100) {
            // Aplicar daño al jugador dos después de 250 milisegundos
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
