import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api/team.api';

export const teamKeys = { mine: ['team', 'mine'] as const, players: ['team', 'players'] as const };
export const useMyTeam = () => useQuery({ queryKey: teamKeys.mine, queryFn: teamApi.getMine });
export const useMyPlayers = () => useQuery({ queryKey: teamKeys.players, queryFn: teamApi.listPlayers });
export const useUpdateMyTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: teamApi.updateMine, onSuccess: () => void queryClient.invalidateQueries({ queryKey: teamKeys.mine }) });
};
export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: teamApi.addPlayer, onSuccess: () => void queryClient.invalidateQueries({ queryKey: teamKeys.players }) });
};
export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: teamApi.updatePlayer, onSuccess: () => void queryClient.invalidateQueries({ queryKey: teamKeys.players }) });
};
export const useRemovePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: teamApi.removePlayer, onSuccess: () => void queryClient.invalidateQueries({ queryKey: teamKeys.players }) });
};
