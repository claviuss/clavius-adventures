import { HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { AnimatedSprite } from 'pixi.js';

export enum PlayerMoveDirection {
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

export enum PlayerAnimation {
    IDLE_MOVING = 1,
    GET_HIT = 2,
    DESTROY = 3
}

export class Player {
    private idleAndMoving: PIXI.Texture[];
    private getHit: PIXI.Texture[];
    private destroyed: PIXI.Texture[];
    private container: PIXI.Container;
    private player: PIXI.AnimatedSprite;

    private playerMoving: PlayerMoveDirection | null;
    private playerAnimation: PlayerAnimation;

    constructor(
        container: PIXI.Container,
        idleAndMoving: PIXI.Texture[],
        getHit: PIXI.Texture[],
        destroyed: PIXI.Texture[]
    ) {
        this.container = container;

        this.idleAndMoving = idleAndMoving;
        this.getHit = getHit;
        this.destroyed = destroyed;

        this.player = new AnimatedSprite(idleAndMoving)
        this.player.animationSpeed = 0.4;
        this.player.scale.set(0.8)
        this.player.play();
        this.playerAnimation = PlayerAnimation.IDLE_MOVING;

        this.player.y = 50
        this.player.x = 50
        this.container.addChild(this.player)

        window.addEventListener("keydown", (event) => this.onKeyDown(event), false);

        this.player.onComplete = () => {
            if (this.playerAnimation === PlayerAnimation.GET_HIT) {
                this.playerAnimation = PlayerAnimation.IDLE_MOVING

                this.player.textures = this.idleAndMoving
                this.player.loop = true;

                this.player.animationSpeed = 0.4;
                this.player.play();
            }
            if (this.playerAnimation === PlayerAnimation.DESTROY) {
                this.container.removeChild(this.player)
            }

        }
    }

    update(dt: number) {
        if (this.playerMoving === PlayerMoveDirection.DOWN) {
            this.player.position.y += 5;
        }

        if (this.playerMoving === PlayerMoveDirection.UP) {
            this.player.position.y -= 5;
        }

        if (this.playerMoving === PlayerMoveDirection.LEFT) {
            this.player.position.x -= 5;
        }

        if (this.playerMoving === PlayerMoveDirection.RIGHT) {
            this.player.position.x += 5;
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') {
            this.playerMoving = PlayerMoveDirection.DOWN
        }

        if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp') {
            this.playerMoving = PlayerMoveDirection.UP
        }

        if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
            this.playerMoving = PlayerMoveDirection.LEFT
        }

        if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
            this.playerMoving = PlayerMoveDirection.RIGHT
        }
        if (this.playerAnimation === PlayerAnimation.IDLE_MOVING) {
            if (event.key === '2') { // GetHit
                this.player.textures = this.getHit;
                this.player.loop = false;
                this.player.animationSpeed = 0.9;
                this.player.play();
                this.playerAnimation = PlayerAnimation.GET_HIT
            }

            if (event.key === '3') {  // Destroy
                this.player.textures = this.destroyed;
                this.player.loop = false;
                this.player.animationSpeed = 0.9;
                this.player.play();
                this.playerAnimation = PlayerAnimation.DESTROY

            }
        }

        if (event.key === 'Shift') {
            this.playerMoving = null
        }
    }


}