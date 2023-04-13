import { HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { AnimatedSprite, Sprite } from 'pixi.js';

export class Projectile {
    private container: PIXI.Container;
    private texture: PIXI.Texture;
    private projectile: PIXI.Sprite;

    private velocity = 5

    constructor(
        container: PIXI.Container,
        texture: PIXI.Texture,
        position: { x: number; y: number }
    ) {
        this.container = container;
        this.texture = texture;


        this.projectile = new Sprite(texture)
        this.projectile.scale.set(0.4)
        this.projectile.alpha = 0;

        this.projectile.x = position.x
        this.projectile.y = position.y
        this.container.addChild(this.projectile) //!

    }

    update(dt: number) {
        if (this.projectile.alpha < 1) {
            this.projectile.alpha += 0.4
        }
        this.velocity += 0.5
        this.projectile.position.x += this.velocity;

    }

    getPosition() {
        const { x, y } = this.projectile.position
        return { x, y }
    }

    remove() {
        this.container.removeChild(this.projectile) //!

    }
}