class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
    this.offset = offset
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })

    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.color = color
    this.isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 13
    this.sprites = sprites
    this.dead = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw()
    if (!this.dead) this.animateFrames()

    // attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 100) {
      this.velocity.y = 0
      this.position.y = 688
    } else this.velocity.y += gravity
  }

  attack() {
    // this.switchSprite('attack1')
    this.isAttacking = true
  }

  takeHit() {
    this.health -= 10
    if (this.health > 9) {
      this.switchSprite('takeHit')
    }
    if (this.health === 0) {
      this.switchSprite("death")
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true
      }
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return
    }
    if (
      player.image === player.sprites.angryattack2.image &&
      player.framesCurrent < player.sprites.angryattack2.framesMax - 1
    ) {
      player.position.y = 650
      return
    }

    // override when fighter gets hit
    else if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) {
      return
    }
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break
      case 'angryidle':
        if (this.image !== this.sprites.angryidle.image) {
          this.image = this.sprites.angryidle.image
          this.framesMax = this.sprites.angryidle.framesMax
          this.framesCurrent = 0
        }
        break
      case 'runfor':
        if (this.image !== this.sprites.runfor.image) {
          this.image = this.sprites.runfor.image
          this.framesMax = this.sprites.runfor.framesMax
          this.framesCurrent = 0
        }
        break
      case 'angryrunfor':
        if (this.image !== this.sprites.angryrunfor.image) {
          this.image = this.sprites.angryrunfor.image
          this.framesMax = this.sprites.angryrunfor.framesMax
          this.framesCurrent = 0
        }
        break
      case 'runback':
        if (this.image !== this.sprites.runback.image) {
          this.image = this.sprites.runback.image
          this.framesMax = this.sprites.runback.framesMax
          this.framesCurrent = 0
        }
        break
      case 'angryrunback':
        if (this.image !== this.sprites.angryrunback.image) {
          this.image = this.sprites.angryrunback.image
          this.framesMax = this.sprites.angryrunback.framesMax
          this.framesCurrent = 0
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
        }
        break
      case 'angryjump':
        if (this.image !== this.sprites.angryjump.image) {
          this.image = this.sprites.angryjump.image
          this.framesMax = this.sprites.angryjump.framesMax
          this.framesCurrent = 0
        }
        break
      case 'angry':
        if (this.image !== this.sprites.angry.image) {
          this.image = this.sprites.angry.image
          this.framesMax = this.sprites.angry.framesMax
          this.framesCurrent = 0
        }
        break
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.framesCurrent = 0
        }
        break
      case 'angryattack2':
        if (this.image !== this.sprites.angryattack2.image) {
          this.image = this.sprites.angryattack2.image
          this.framesMax = this.sprites.angryattack2.framesMax
          this.framesCurrent = 0
        }
        break
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
        }
        break
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.framesCurrent = 0
        }
        break
    }
  }
}
