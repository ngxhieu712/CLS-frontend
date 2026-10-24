// ─── Esports domain types shared across all modules ───────────────────────

export type MatchStatus = 'scheduled' | 'ongoing' | 'pending_confirm' | 'confirmed' | 'cancelled';
export type RoundFormat = 'BO1' | 'BO3' | 'BO5';
export type RecordingStatus = 'none' | 'editing' | 'published';
export type TournamentPhase = 'group' | 'playoff';

export interface Team {
  _id: string;
  name: string;
  tag: string;
  logoUrl?: string;
  groupId?: string;
  contactEmail?: string;
  players?: Player[];
}

export interface Player {
  _id: string;
  name: string;
  ingameName: string;
  role?: string;
  isStarter: boolean;
  teamId: string;
}

export interface Group {
  _id: string;
  name: string; // e.g. "Bảng A"
  teams: Team[];
  standings: StandingRow[];
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  teamTag: string;
  logoUrl?: string;
  wins: number;
  losses: number;
  goalDiff: number; // map diff
  points: number;
  rank: number;
  advance?: boolean; // top 2 đi tiếp
}

export interface GameResult {
  _id: string;
  gameNumber: number;
  winnerId?: string;
  /** Provisional — trọng tài đã nhập nhưng admin chưa xác nhận */
  isProvisional?: boolean;
}

export interface Match {
  _id: string;
  round: string; // "Vòng 1", "Tứ kết", ...
  format: RoundFormat;
  status: MatchStatus;
  scheduledAt: string; // ISO
  teamA?: Team;
  teamB?: Team;
  scoreA?: number; // số ván thắng
  scoreB?: number;
  isProvisional?: boolean; // tỉ số tạm thời chưa xác nhận
  winnerId?: string;
  groupId?: string;
  games: GameResult[];
  refereeId?: string;
  refereeName?: string;
  highlightUrl?: string;
  youtubeUrl?: string;
  recordingStatus?: RecordingStatus;
  notes?: string;
  phase: TournamentPhase;
}

export interface BracketSlot {
  matchId?: string;
  match?: Match;
  round: number; // 1 = QF, 2 = SF, 3 = Final
  position: number; // index in round
}

export interface Tournament {
  _id: string;
  name: string;
  format: string;
  groupCount: number;
  teamsPerGroup: number;
  advanceCount: number; // đội đi tiếp mỗi bảng
  defaultFormat: RoundFormat;
  scoringRule: string;
  status: 'setup' | 'group' | 'playoff' | 'finished';
  startDate?: string;
  endDate?: string;
}

export interface ResultLog {
  _id: string;
  matchId: string;
  actorId: string;
  actorEmail: string;
  action: 'submit' | 'confirm' | 'edit' | 'reopen';
  oldValue?: string;
  newValue?: string;
  reason?: string;
  createdAt: string;
}
