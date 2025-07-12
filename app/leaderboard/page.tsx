import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';

export default function Leaderboard() {
  // Placeholder data
  const leaderboardData = [
    { rank: 1, name: 'Sarah Johnson', score: 2850, completedSimulations: 12, badge: '🥇' },
    { rank: 2, name: 'Mike Chen', score: 2720, completedSimulations: 11, badge: '🥈' },
    { rank: 3, name: 'Emily Davis', score: 2680, completedSimulations: 10, badge: '🥉' },
    { rank: 4, name: 'Alex Thompson', score: 2450, completedSimulations: 9, badge: '' },
    { rank: 5, name: 'Jessica Martinez', score: 2320, completedSimulations: 8, badge: '' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <p className="text-lg text-gray-600">
          Top performers in JobSim simulations
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Score</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Simulations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboardData.map((user) => (
                <tr key={user.rank} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">#{user.rank}</span>
                      {user.badge && <span className="text-2xl">{user.badge}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success" className="text-lg">
                      {user.score}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-600">{user.completedSimulations}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Complete more simulations to climb the leaderboard!
        </p>
      </div>
    </div>
  );
}