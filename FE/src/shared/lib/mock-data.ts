// ─── Mock data — thay bằng API call khi BE sẵn sàng ──────────────────────
import type { Group, Match, Team, Tournament, BracketSlot } from '@/shared/types/esports.types';

export const MOCK_TEAMS: Team[] = [
  { _id: 't1', name: 'Team Alpha', tag: 'ALF', logoUrl: undefined, groupId: 'g1' },
  { _id: 't2', name: 'Dragon Force', tag: 'DRG', logoUrl: undefined, groupId: 'g1' },
  { _id: 't3', name: 'Storm Riders', tag: 'STR', logoUrl: undefined, groupId: 'g1' },
  { _id: 't4', name: 'Iron Shield', tag: 'IRN', logoUrl: undefined, groupId: 'g1' },
  { _id: 't5', name: 'Phoenix Rise', tag: 'PHX', logoUrl: undefined, groupId: 'g2' },
  { _id: 't6', name: 'Dark Matter', tag: 'DKM', logoUrl: undefined, groupId: 'g2' },
  { _id: 't7', name: 'Cyber Wolves', tag: 'CYW', logoUrl: undefined, groupId: 'g2' },
  { _id: 't8', name: 'Steel Hawks', tag: 'STH', logoUrl: undefined, groupId: 'g2' },
  { _id: 't9', name: 'Titan Corps', tag: 'TTN', logoUrl: undefined, groupId: 'g3' },
  { _id: 't10', name: 'Neon Blaze', tag: 'NBL', logoUrl: undefined, groupId: 'g3' },
  { _id: 't11', name: 'Shadow Strike', tag: 'SHD', logoUrl: undefined, groupId: 'g3' },
  { _id: 't12', name: 'Gold Rush', tag: 'GLD', logoUrl: undefined, groupId: 'g3' },
  { _id: 't13', name: 'Void Walkers', tag: 'VDW', logoUrl: undefined, groupId: 'g4' },
  { _id: 't14', name: 'Crimson Edge', tag: 'CRM', logoUrl: undefined, groupId: 'g4' },
  { _id: 't15', name: 'Frost Bite', tag: 'FRB', logoUrl: undefined, groupId: 'g4' },
  { _id: 't16', name: 'Last Stand', tag: 'LST', logoUrl: undefined, groupId: 'g4' },
];

export const MOCK_GROUPS: Group[] = [
  {
    _id: 'g1', name: 'Bảng A',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g1'),
    standings: [
      { teamId: 't1', teamName: 'Team Alpha', teamTag: 'ALF', wins: 3, losses: 0, goalDiff: 6, points: 9, rank: 1, advance: true },
      { teamId: 't2', teamName: 'Dragon Force', teamTag: 'DRG', wins: 2, losses: 1, goalDiff: 2, points: 6, rank: 2, advance: true },
      { teamId: 't3', teamName: 'Storm Riders', teamTag: 'STR', wins: 1, losses: 2, goalDiff: -2, points: 3, rank: 3 },
      { teamId: 't4', teamName: 'Iron Shield', teamTag: 'IRN', wins: 0, losses: 3, goalDiff: -6, points: 0, rank: 4 },
    ],
  },
  {
    _id: 'g2', name: 'Bảng B',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g2'),
    standings: [
      { teamId: 't5', teamName: 'Phoenix Rise', teamTag: 'PHX', wins: 3, losses: 0, goalDiff: 5, points: 9, rank: 1, advance: true },
      { teamId: 't6', teamName: 'Dark Matter', teamTag: 'DKM', wins: 1, losses: 2, goalDiff: -1, points: 3, rank: 2, advance: true },
      { teamId: 't7', teamName: 'Cyber Wolves', teamTag: 'CYW', wins: 1, losses: 2, goalDiff: -1, points: 3, rank: 3 },
      { teamId: 't8', teamName: 'Steel Hawks', teamTag: 'STH', wins: 1, losses: 2, goalDiff: -3, points: 3, rank: 4 },
    ],
  },
  {
    _id: 'g3', name: 'Bảng C',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g3'),
    standings: [
      { teamId: 't9', teamName: 'Titan Corps', teamTag: 'TTN', wins: 2, losses: 1, goalDiff: 3, points: 6, rank: 1, advance: true },
      { teamId: 't10', teamName: 'Neon Blaze', teamTag: 'NBL', wins: 2, losses: 1, goalDiff: 1, points: 6, rank: 2, advance: true },
      { teamId: 't11', teamName: 'Shadow Strike', teamTag: 'SHD', wins: 2, losses: 1, goalDiff: 1, points: 6, rank: 3 },
      { teamId: 't12', teamName: 'Gold Rush', teamTag: 'GLD', wins: 0, losses: 3, goalDiff: -5, points: 0, rank: 4 },
    ],
  },
  {
    _id: 'g4', name: 'Bảng D',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g4'),
    standings: [
      { teamId: 't13', teamName: 'Void Walkers', teamTag: 'VDW', wins: 3, losses: 0, goalDiff: 7, points: 9, rank: 1, advance: true },
      { teamId: 't14', teamName: 'Crimson Edge', teamTag: 'CRM', wins: 2, losses: 1, goalDiff: 2, points: 6, rank: 2, advance: true },
      { teamId: 't15', teamName: 'Frost Bite', teamTag: 'FRB', wins: 1, losses: 2, goalDiff: -3, points: 3, rank: 3 },
      { teamId: 't16', teamName: 'Last Stand', teamTag: 'LST', wins: 0, losses: 3, goalDiff: -6, points: 0, rank: 4 },
    ],
  },
];

const now = new Date();
const h = (delta: number) => new Date(now.getTime() + delta * 3600_000).toISOString();

export const MOCK_MATCHES: Match[] = [
  // Đang đấu
  {
    _id: 'm1', round: 'Vòng 3 — Bảng A', format: 'BO3', status: 'ongoing', scheduledAt: h(-1),
    teamA: MOCK_TEAMS[0], teamB: MOCK_TEAMS[1], scoreA: 1, scoreB: 0, isProvisional: true,
    games: [{ _id: 'g1', gameNumber: 1, winnerId: 't1', isProvisional: true }],
    phase: 'group', groupId: 'g1',
  },
  // Sắp diễn ra
  {
    _id: 'm2', round: 'Vòng 3 — Bảng B', format: 'BO3', status: 'scheduled', scheduledAt: h(2),
    teamA: MOCK_TEAMS[4], teamB: MOCK_TEAMS[5], scoreA: undefined, scoreB: undefined,
    games: [], phase: 'group', groupId: 'g2',
  },
  {
    _id: 'm3', round: 'Vòng 3 — Bảng C', format: 'BO1', status: 'scheduled', scheduledAt: h(4),
    teamA: MOCK_TEAMS[8], teamB: MOCK_TEAMS[9], games: [], phase: 'group', groupId: 'g3',
  },
  // Chờ xác nhận
  {
    _id: 'm4', round: 'Vòng 2 — Bảng D', format: 'BO3', status: 'pending_confirm', scheduledAt: h(-24),
    teamA: MOCK_TEAMS[12], teamB: MOCK_TEAMS[13], scoreA: 2, scoreB: 1, isProvisional: true,
    games: [
      { _id: 'g1', gameNumber: 1, winnerId: 't13' },
      { _id: 'g2', gameNumber: 2, winnerId: 't14' },
      { _id: 'g3', gameNumber: 3, winnerId: 't13' },
    ],
    phase: 'group', groupId: 'g4',
  },
  // Đã xác nhận
  {
    _id: 'm5', round: 'Vòng 1 — Bảng A', format: 'BO1', status: 'confirmed', scheduledAt: h(-72),
    teamA: MOCK_TEAMS[0], teamB: MOCK_TEAMS[2], scoreA: 1, scoreB: 0,
    games: [{ _id: 'g1', gameNumber: 1, winnerId: 't1' }],
    winnerId: 't1', phase: 'group', groupId: 'g1',
    highlightUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
    youtubeUrl: 'https://youtube.com/watch?v=demo',
    recordingStatus: 'published',
  },
  {
    _id: 'm6', round: 'Vòng 1 — Bảng B', format: 'BO3', status: 'confirmed', scheduledAt: h(-48),
    teamA: MOCK_TEAMS[4], teamB: MOCK_TEAMS[6], scoreA: 2, scoreB: 0,
    games: [
      { _id: 'g1', gameNumber: 1, winnerId: 't5' },
      { _id: 'g2', gameNumber: 2, winnerId: 't5' },
    ],
    winnerId: 't5', phase: 'group', groupId: 'g2', recordingStatus: 'editing',
  },
  // Playoff matches (placeholder)
  {
    _id: 'qf1', round: 'Tứ kết 1', format: 'BO3', status: 'scheduled', scheduledAt: h(72),
    teamA: MOCK_TEAMS[0], teamB: MOCK_TEAMS[13], games: [], phase: 'playoff',
  },
  {
    _id: 'qf2', round: 'Tứ kết 2', format: 'BO3', status: 'scheduled', scheduledAt: h(72),
    teamA: MOCK_TEAMS[4], teamB: MOCK_TEAMS[9], games: [], phase: 'playoff',
  },
  {
    _id: 'qf3', round: 'Tứ kết 3', format: 'BO3', status: 'scheduled', scheduledAt: h(96),
    teamA: MOCK_TEAMS[8], teamB: MOCK_TEAMS[5], games: [], phase: 'playoff',
  },
  {
    _id: 'qf4', round: 'Tứ kết 4', format: 'BO3', status: 'scheduled', scheduledAt: h(96),
    teamA: MOCK_TEAMS[12], teamB: MOCK_TEAMS[1], games: [], phase: 'playoff',
  },
  {
    _id: 'sf1', round: 'Bán kết 1', format: 'BO3', status: 'scheduled', scheduledAt: h(144),
    games: [], phase: 'playoff',
  },
  {
    _id: 'sf2', round: 'Bán kết 2', format: 'BO3', status: 'scheduled', scheduledAt: h(144),
    games: [], phase: 'playoff',
  },
  {
    _id: 'final', round: 'Chung kết', format: 'BO5', status: 'scheduled', scheduledAt: h(216),
    games: [], phase: 'playoff',
  },
];

export const MOCK_TOURNAMENT: Tournament = {
  _id: 'tour1',
  name: 'Champion League Season 1',
  format: 'Vòng bảng + Playoff nhánh đơn',
  groupCount: 4,
  teamsPerGroup: 4,
  advanceCount: 2,
  defaultFormat: 'BO3',
  scoringRule: 'Thắng 3đ, Thua 0đ',
  status: 'group',
  startDate: new Date(now.getTime() - 7 * 86400_000).toISOString(),
  endDate: new Date(now.getTime() + 14 * 86400_000).toISOString(),
};

export const MOCK_BRACKET: BracketSlot[] = [
  { round: 1, position: 0, matchId: 'qf1', match: MOCK_MATCHES.find(m => m._id === 'qf1') },
  { round: 1, position: 1, matchId: 'qf2', match: MOCK_MATCHES.find(m => m._id === 'qf2') },
  { round: 1, position: 2, matchId: 'qf3', match: MOCK_MATCHES.find(m => m._id === 'qf3') },
  { round: 1, position: 3, matchId: 'qf4', match: MOCK_MATCHES.find(m => m._id === 'qf4') },
  { round: 2, position: 0, matchId: 'sf1', match: MOCK_MATCHES.find(m => m._id === 'sf1') },
  { round: 2, position: 1, matchId: 'sf2', match: MOCK_MATCHES.find(m => m._id === 'sf2') },
  { round: 3, position: 0, matchId: 'final', match: MOCK_MATCHES.find(m => m._id === 'final') },
];

// ─── Mock pending team applications ──────────────────────────────────────
export interface TeamApplication {
  _id: string;
  teamName: string;
  teamTag: string;
  teamEmail: string;
  teamPhone: string;
  teamOrganization?: string;
  managerName: string;
  managerEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  submittedAt: string;
}

export const MOCK_APPLICATIONS: TeamApplication[] = [
  {
    _id: 'app1', teamName: 'Nova Esports', teamTag: 'NVE',
    teamEmail: 'nova@esports.vn', teamPhone: '0901234567',
    teamOrganization: 'Nova Gaming Club',
    managerName: 'Trần Minh Khoa', managerEmail: 'khoa@gmail.com',
    status: 'pending', submittedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    _id: 'app2', teamName: 'Red Phoenix', teamTag: 'RPX',
    teamEmail: 'redphoenix@gmail.com', teamPhone: '0912345678',
    managerName: 'Lê Văn Hùng', managerEmail: 'hung.lv@gmail.com',
    status: 'pending', submittedAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    _id: 'app3', teamName: 'Blue Storm', teamTag: 'BLS',
    teamEmail: 'bluestorm@gmail.com', teamPhone: '0923456789',
    managerName: 'Nguyễn Thị Mai', managerEmail: 'mai.nt@gmail.com',
    status: 'pending', submittedAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
  },
  {
    _id: 'app4', teamName: 'Titan Force', teamTag: 'TTF',
    teamEmail: 'titanforce@gmail.com', teamPhone: '0934567890',
    managerName: 'Phạm Đức Long', managerEmail: 'long.pd@gmail.com',
    status: 'rejected', rejectReason: 'Tên đội trùng với đội đã đăng ký trước đó.',
    submittedAt: new Date(Date.now() - 48 * 3600_000).toISOString(),
  },
];
