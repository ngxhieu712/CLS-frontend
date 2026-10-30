import { http } from '@/shared/api/http';
import type { ManagedTeam, PlayerInput, TeamInput, TeamPlayer } from '../types/team.types';

export const teamApi = {
  getMine: () => http.get<ManagedTeam>('/teams/me').then((response) => response.data),
  updateMine: (input: TeamInput) => http.patch<ManagedTeam>('/teams/me', input).then((response) => response.data),
  listPlayers: () => http.get<TeamPlayer[]>('/teams/me/players').then((response) => response.data),
  addPlayer: (input: PlayerInput) => http.post<TeamPlayer>('/teams/me/players', input).then((response) => response.data),
  updatePlayer: ({ id, input }: { id: string; input: Partial<PlayerInput> }) => http.patch<TeamPlayer>(`/teams/me/players/${id}`, input).then((response) => response.data),
  removePlayer: (id: string) => http.delete(`/teams/me/players/${id}`).then(() => undefined),
};
