import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="bg-purple-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Reading Game</h1>
        <div class="space-x-4">
          <a routerLink="/" routerLinkActive="text-purple-200" 
             [routerLinkActiveOptions]="{exact: true}"
             class="hover:text-purple-200 transition-colors">
            Play
          </a>
          <a routerLink="/leaderboard" routerLinkActive="text-purple-200"
             class="hover:text-purple-200 transition-colors">
            Leaderboard
          </a>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})