import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GameComponent } from './features/game/game.component';
import { LeaderboardComponent } from './features/leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: GameComponent },
      { path: 'leaderboard', component: LeaderboardComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})