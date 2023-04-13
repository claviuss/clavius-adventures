import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AnimatedSprite, Application, Assets, ResolverAssetsObject, Texture } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Player } from './elements/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // if you want to use structural directives, we should use static false (for eg. ngIf, ngFor...)
  @ViewChild('pixiGameContainer', { static: true }) pixiGameContainer: ElementRef

  game = new Application({ width: 1920, height: 1080, backgroundAlpha: 0 });
  loading = 0;
  character: PIXI.AnimatedSprite;
  enemy: PIXI.AnimatedSprite;

  gameAssets: any;
  player: Player;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.loadAssets()
  }

  async loadAssets() {

    // # Commander
    const commanderTalk01Assets: ResolverAssetsObject = {}
    for (let i = 0; i < 18; i++) {
      commanderTalk01Assets[`commander-talk-sprite-${i + 1}`] = `assets/characters/commander/talk-01/sprite${i + 1}.png`
    }
    Assets.addBundle('commanderTalk01', commanderTalk01Assets)

    // # Enemy
    const enemyAnimationAssets: ResolverAssetsObject = {}
    for (let i = -1; i < 25; i++) {
      enemyAnimationAssets[`skeleton-Moving-${i + 1}`] = `assets/characters/enemy/type-01/moving/skeleton-Moving_${i + 1}.png`
    }
    Assets.addBundle('enemyAnimation', enemyAnimationAssets)


    // #Player - Plane Idle Moving
    const playerPlaneIdelMovingAssets: ResolverAssetsObject = {}
    for (let i = -1; i < 13; i++) {
      playerPlaneIdelMovingAssets[`player-plane-01-skeleton-MovingNIdle-${i + 1}`] = `assets/players/plane-01/idle-and-moving/skeleton-MovingNIdle_${i + 1}.png`
    }
    Assets.addBundle('planeIdelMoving', playerPlaneIdelMovingAssets)

    // #Player - Plane Get Hit
    const playerPlaneGetHitAssets: ResolverAssetsObject = {}
    for (let i = -1; i < 13; i++) {
      playerPlaneGetHitAssets[`player-plane-01-skeleton-GetHit-${i + 1}`] = `assets/players/plane-01/get-hit/skeleton-GetHit_${i + 1}.png`
    }
    Assets.addBundle('playerPlaneGetHitAssets', playerPlaneGetHitAssets)

    // #Player - Plane Get Hit
    const playerPlaneDestroyed: ResolverAssetsObject = {}
    for (let i = -1; i < 21; i++) {
      playerPlaneDestroyed[`player-plane-01-skeleton-Destroy-${i + 1}`] = `assets/players/plane-01/destroyed/skeleton-Destroy_${i + 1}.png`
    }
    Assets.addBundle('playerPlaneDestroyed', playerPlaneDestroyed)

    // #Player - Projectile
    const playerProjectiles: ResolverAssetsObject = {}
    const playerProjectileOptions: ResolverAssetsObject = {}

    for (let i = 0; i < 15; i++) {
      playerProjectiles[`player-projectiles-${i + 1}`] = `assets/projectile/${i + 1 < 10 ? 0 : ''}${i + 1}.png`

    }
    Assets.addBundle('playerProjectiles', playerProjectiles)

    this.gameAssets = await Assets.loadBundle([
      'commanderTalk01',
      'enemyAnimation',
      'planeIdelMoving',
      'playerPlaneGetHitAssets',
      'playerPlaneDestroyed',
      'playerProjectiles',
    ], (loadingPercentage) => {
      this.loading = Math.floor(loadingPercentage * 100);
    })

    // 📅 Day 1
    // this.addGame()

    // 📅 Day 2
    this.addGameWithPlayer()
  }


  addGame() {
    this.character = new AnimatedSprite(Object.values<PIXI.Texture>(this.gameAssets.commanderTalk01))

    this.character.animationSpeed = 0.4;
    this.character.play();

    this.enemy = new AnimatedSprite(Object.values<PIXI.Texture>(this.gameAssets.enemyAnimation))
    this.enemy.y = 200
    this.enemy.x = 600
    this.enemy.animationSpeed = 0.4;
    this.enemy.scale.set(0.6)
    this.enemy.play();

    this.game.stage.addChild(this.character)
    this.game.stage.addChild(this.enemy)

    this.pixiGameContainer.nativeElement.appendChild(this.game.view);

    this.game.view.style!.width = '100%';

    this.game.ticker.minFPS = 60
    this.game.ticker.maxFPS = 60
    this.game.ticker.add((dt) => {
      this.enemy.x -= 6
    })
  }

  addGameWithPlayer() {
    this.game.view.style!.height = '100%';

    this.renderer.appendChild(this.pixiGameContainer.nativeElement, this.game.view)

    const idleAndMoving = Object.values<PIXI.Texture>(this.gameAssets.planeIdelMoving)
    const getHit = Object.values<PIXI.Texture>(this.gameAssets.playerPlaneGetHitAssets)
    const destroyed = Object.values<PIXI.Texture>(this.gameAssets.playerPlaneDestroyed)
    const playerProjectiles = Object.values<PIXI.Texture>(this.gameAssets.playerProjectiles)

    this.player = new Player(this.game.stage, idleAndMoving, getHit, destroyed, playerProjectiles);

    this.game.ticker.minFPS = 60
    this.game.ticker.maxFPS = 60
    this.game.ticker.add((dt) => {
      this.player.update(dt)
    })
  }
}
