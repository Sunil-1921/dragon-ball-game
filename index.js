const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1665
canvas.height = 937

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/bg.jpg'
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  scale: 2,
  offset: {
    x: -100,
    y: 80
  },
  sprites: {
    idle: {
      imageSrc: './img/goku/gokuIdle.png',
      framesMax: 2
    },
    angryidle: {
      imageSrc: './img/goku/angry/GokuIdle-Angry.png',
      framesMax: 2
    },
    angry: {
      imageSrc: './img/goku/angry/Angry.png',
      framesMax: 4
    },
    runfor: {
      imageSrc: './img/goku/RunForward.png',
      framesMax: 1
    },
    angryrunfor: {
      imageSrc: './img/goku/angry/RunForward-Angry.png',
      framesMax: 1
    },
    runback: {
      imageSrc: './img/goku/RunBackward.png',
      framesMax: 1
    },
    angryrunback: {
      imageSrc: './img/goku/angry/RunBackward-Angry.png',
      framesMax: 1
    },
    jump: {
      imageSrc: './img/goku/Jump.png',
      framesMax: 1
    },
    angryjump: {
      imageSrc: './img/goku/angry/Jump-Angry.png',
      framesMax: 1
    },
    attack1: {
      imageSrc: './img/goku/Attack1.png',
      framesMax: 3
    },
    angryattack2: {
      imageSrc: './img/goku/angry/Attack2-Angry.png',
      framesMax: 7
    },
    attack2: {
      imageSrc: './img/goku/Attack2.png',
      framesMax: 3
    },
    takeHit: {
      imageSrc: './img/goku/TakeHit.png',
      framesMax: 5
    },
    death: {
      imageSrc: './img/goku/Death.png',
      framesMax: 3
    }
  },
  attackBox: {
    offset: {
      x: 20,
      y: 40
    },
    width: 60,
    height: 30
  }
})

const enemy = new Fighter({
  position: {
    x: 200,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  scale: 2,
  offset: {
    x: -100,
    y: 80
  },
  sprites: {
    idle: {
      imageSrc: './img/vageta/Idle.png',
      framesMax: 2
    },
    runfor: {
      imageSrc: './img/vageta/RunForward.png',
      framesMax: 1
    },
    runback: {
      imageSrc: './img/vageta/RunBackward.png',
      framesMax: 1
    },
    jump: {
      imageSrc: './img/vageta/Jump.png',
      framesMax: 1
    },
    attack1: {
      imageSrc: './img/vageta/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/vageta/TakeHit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/vageta/Death.png',
      framesMax: 3
    }
  },
  attackBox: {
    offset: {
      x: -50,
      y: 40
    },
    width: 50,
    height: 30
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  e: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

const modes = {
  getangry: false,
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    if (!modes.getangry) {
      player.velocity.x = -4
      player.switchSprite('runback')
    }
    else {
      player.velocity.x = -7
      player.switchSprite('angryrunback')
    }
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if (!modes.getangry) {
      player.velocity.x = 4
      player.switchSprite('runfor')
    } else {
      player.velocity.x = 7
      player.switchSprite('angryrunfor')
    }
  } else if (keys.e.pressed && player.lastKey === 'e') {
    if (!modes.getangry) {
      player.switchSprite('angry')
      setTimeout(() => {
        keys.e.pressed = false
      }, 660);
    }
    modes.getangry = true
  } else {
    if (!modes.getangry) {
      player.switchSprite('idle')
    } else {
      player.switchSprite('angryidle')
    }
  }

  // jumping
  if (player.velocity.y < 0) {
    if (!modes.getangry) {
      player.switchSprite('jump')
    } else {
      player.switchSprite('angryjump')
    }
  }
  else if (player.velocity.y > 0) {
    if (!modes.getangry) {
      player.switchSprite('jump')
    } else {
      player.switchSprite('angryjump')
    }
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -4
    enemy.switchSprite('runfor')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 4
    enemy.switchSprite('runback')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('jump')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
    // player.framesCurrent === 4
  ) {
    enemy.takeHit()
    if (!enemy.dead) {
      enemy.velocity.x = 10
    }
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  // if (player.isAttacking && player.framesCurrent === 1) {
  if (player.isAttacking) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking
  ) {
    player.takeHit()
    if (!player.dead) {
      player.velocity.x = -10
    }
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'e':
        keys.e.pressed = true
        player.lastKey = 'e'
        break
      case 'w':
        if (player.position.y > 680) {
          if (modes.getangry) {
            player.velocity.y = -20
          }
          else {
            player.velocity.y = -15
          }
        }
        break
      case ' ':
        if (modes.getangry) {
          player.switchSprite('angryattack2')
        } else {
          player.switchSprite('attack1')
        }
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.position.y > 680) {
          enemy.velocity.y = -15
        }
        break
      case 'ArrowDown':
        enemy.switchSprite('attack1')
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
