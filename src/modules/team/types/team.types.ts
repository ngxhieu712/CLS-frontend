export type TeamProfileStatus = 'pending' | 'approved' | 'rejected';
export type PlayerStatus = 'starter' | 'substitute';

export interface ManagedTeam {
  _id: string;
  name: string;
  tag: string;
  logo: string;
  description: string;
  organization: string;
  contactEmail: string;
  contactPhone: string;
  profileStatus: TeamProfileStatus;
  rejectReason: string;
}

export interface TeamInput {
  name?: string;
  tag?: string;
  logo?: string;
  description?: string;
  organization?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface TeamPlayer {
  _id: string;
  nickname: string;
  fullName?: string;
  avatar: string;
  position?: string;
  inGameId?: string;
  status: PlayerStatus;
  team: string;
}

export interface PlayerInput {
  nickname: string;
  fullName?: string;
  avatar?: string;
  position?: string;
  inGameId?: string;
  status?: PlayerStatus;
}
