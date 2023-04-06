import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimatedSprite, Application, Assets, ResolverAssetsObject, Texture } from 'pixi.js';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('pixiGameContainer', { static: false }) pixiGameContainer: ElementRef

  game = new Application({ width: 1920, height: 1080, backgroundAlpha: 0 });
  loading = 0;
  character: PIXI.AnimatedSprite;
  enemy: PIXI.AnimatedSprite;

  gameAssets: any;

  ngOnInit(): void {

    this.loadAssets()
  }

  async loadAssets() {

    const commanderTalk01Assets: ResolverAssetsObject = {}
    for (let i = 0; i < 18; i++) {
      commanderTalk01Assets[`ct-sprite${i + 1}`] = `assets/characters/commander/talk-01/sprite${i + 1}.png`
    }
    Assets.addBundle('commanderTalk01', commanderTalk01Assets)

    const enemyAnimationAssets: ResolverAssetsObject = {}
    for (let i = -1; i < 25; i++) {
      enemyAnimationAssets[`ea-sprite${i + 1}`] = `assets/characters/enemy/type-01/moving/skeleton-Moving_${i + 1}.png`
    }
    Assets.addBundle('enemyAnimation', enemyAnimationAssets)


    this.gameAssets = await Assets.loadBundle(['commanderTalk01', 'enemyAnimation'], (loadingPercentage) => {
      this.loading = Math.floor(loadingPercentage * 100);
    })
    this.addGame()
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
}
