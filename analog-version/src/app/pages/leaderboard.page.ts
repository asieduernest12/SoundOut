import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../core/services/leaderboard.service';
import { LeaderboardEntry } from '../core/models/player.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-center text-purple-800 mb-8">Weekly Leaderboard</h1>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          <!-- Loading State -->
          <div *ngIf="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          </div>

          <!-- Error State -->
          <div *ngIf="error" class="p-8 text-center text-red-600">
            {{ error }}
          </div>

          <!-- Leaderboard Table -->
          <table *ngIf="!loading && !error" class="w-full">
            <thead class="bg-purple-500 text-white">
              <tr>
                <th class="px-6 py-3 text-left">Rank</th>
                <th class="px-6 py-3 text-left">Player</th>
                <th class="px-6 py-3 text-right">Points</th>
                <th class="px-6 py-3 text-right">Words</th>
                <th class="px-6 py-3 text-right">Avg. Attempts</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let entry of leaderboard; let i = index"
                  class="hover:bg-gray-50">
                <td class="px-6 py-4">{{ i + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ entry.displayName }}</div>
                  <div class="text-sm text-gray-500">@{{ entry.username }}</div>
                </td>
                <td class="px-6 py-4 text-right font-medium text-purple-600">
                  {{ entry.totalPoints }}
                </td>
                <td class="px-6 py-4 text-right text-gray-500">
                  {{ entry.wordsCompleted }}
                </td>
                <td class="px-6 py-4 text-right text-gray-500">
                  {{ entry.avgAttempts | number:'1.1-1' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    DecimalPipe
  ]
})
export default class LeaderboardPage implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  loading = true;
  error: string | null = null;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  private loadLeaderboard(): void {
    this.leaderboardService.getWeeklyLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load leaderboard';
        this.loading = false;
      }
    });
  }
}