// ─── Mock data — thay bằng API call khi BE sẵn sàng ──────────────────────
import type { Group, Match, Team, Tournament, BracketSlot } from '@/shared/types/esports.types';

export const MOCK_TEAMS: Team[] = [
  { _id: 't1',  name: 'Vortex',         tag: 'VTX', logoUrl: '/logos/vortex.jpg',        groupId: 'g1' },
  { _id: 't2',  name: 'Phoenix',        tag: 'PHX', logoUrl: '/logos/phoenix.jpg',        groupId: 'g1' },
  { _id: 't3',  name: 'Apex Predator',  tag: 'APX', logoUrl: '/logos/apexpredator.jpg',   groupId: 'g1' },
  { _id: 't4',  name: 'Savage Shark',   tag: 'SS',  logoUrl: '/logos/savage_shark.jpg',   groupId: 'g1' },
  { _id: 't5',  name: 'Tiger',          tag: 'TGR', logoUrl: '/logos/tiger.jpg',          groupId: 'g2' },
  { _id: 't6',  name: 'Head Wolf',      tag: 'HWF', logoUrl: '/logos/head_wolf.jpg',      groupId: 'g2' },
  { _id: 't7',  name: 'Hydra',          tag: 'HYD', logoUrl: '/logos/hydra.jpg',          groupId: 'g2' },
  { _id: 't8',  name: 'Kraken',         tag: 'KRK', logoUrl: '/logos/kraken.jpg',         groupId: 'g2' },
  { _id: 't9',  name: 'Phantom',        tag: 'PHM', logoUrl: '/logos/phantom.jpg',        groupId: 'g3' },
  { _id: 't10', name: 'Ninja',          tag: 'NJA', logoUrl: '/logos/ninja.jpg',          groupId: 'g3' },
  { _id: 't11', name: 'Thunder Eagle',  tag: 'TDE', logoUrl: '/logos/thunder_eagle.jpg',  groupId: 'g3' },
  { _id: 't12', name: 'Viper',          tag: 'VPR', logoUrl: '/logos/viper.jpg',          groupId: 'g3' },
  { _id: 't13', name: 'Black Panther',  tag: 'BKP', logoUrl: '/logos/black_panther.jpg',  groupId: 'g4' },
  { _id: 't14', name: 'Dead Game',      tag: 'DGM', logoUrl: '/logos/deadgame.jpg',       groupId: 'g4' },
  { _id: 't15', name: 'Frost',          tag: 'FRS', logoUrl: '/logos/frost.jpg',          groupId: 'g4' },
  { _id: 't16', name: 'Valkyrie',       tag: 'VLK', logoUrl: '/logos/valkyrie.jpg',       groupId: 'g4' },
];

export const MOCK_GROUPS: Group[] = [
  {
    _id: 'g1', name: 'Bảng A',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g1'),
    standings: [
      { teamId: 't1', teamName: 'Vortex',        teamTag: 'VTX', wins: 13, losses: 1, goalDiff: 6,  points: 33, rank: 1, advance: true,  logoUrl: '/logos/vortex.jpg'       },
      { teamId: 't2', teamName: 'Phoenix',        teamTag: 'PHX', wins: 12, losses: 2, goalDiff: 2,  points: 23, rank: 2, advance: true,  logoUrl: '/logos/phoenix.jpg'       },
      { teamId: 't3', teamName: 'Apex Predator',  teamTag: 'APX', wins: 10, losses: 3, goalDiff: -2, points: 15, rank: 3,                 logoUrl: '/logos/apexpredator.jpg'  },
      { teamId: 't4', teamName: 'Savage Shark',   teamTag: 'SS',  wins: 3,  losses: 8, goalDiff: -6, points: 0,  rank: 4,                 logoUrl: '/logos/savage_shark.jpg'  },
    ],
  },
  {
    _id: 'g2', name: 'Bảng B',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g2'),
    standings: [
      { teamId: 't5', teamName: 'Tiger',     teamTag: 'TGR', wins: 6, losses: 4, goalDiff: 5,  points: 10, rank: 1, advance: true,  logoUrl: '/logos/tiger.jpg'     },
      { teamId: 't6', teamName: 'Head Wolf', teamTag: 'HWF', wins: 6, losses: 4, goalDiff: -1, points: 10, rank: 2, advance: true,  logoUrl: '/logos/head_wolf.jpg' },
      { teamId: 't7', teamName: 'Hydra',     teamTag: 'HYD', wins: 1, losses: 2, goalDiff: -1, points: 3,  rank: 3,                 logoUrl: '/logos/hydra.jpg'     },
      { teamId: 't8', teamName: 'Kraken',    teamTag: 'KRK', wins: 1, losses: 2, goalDiff: -3, points: 3,  rank: 4,                 logoUrl: '/logos/kraken.jpg'    },
    ],
  },
  {
    _id: 'g3', name: 'Bảng C',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g3'),
    standings: [
      { teamId: 't9',  teamName: 'Phantom',       teamTag: 'PHM', wins: 2, losses: 1, goalDiff: 3,  points: 6, rank: 1, advance: true,  logoUrl: '/logos/phantom.jpg'       },
      { teamId: 't10', teamName: 'Ninja',          teamTag: 'NJA', wins: 2, losses: 1, goalDiff: 1,  points: 6, rank: 2, advance: true,  logoUrl: '/logos/ninja.jpg'         },
      { teamId: 't11', teamName: 'Thunder Eagle',  teamTag: 'TDE', wins: 2, losses: 1, goalDiff: 1,  points: 6, rank: 3,                 logoUrl: '/logos/thunder_eagle.jpg' },
      { teamId: 't12', teamName: 'Viper',          teamTag: 'VPR', wins: 0, losses: 3, goalDiff: -5, points: 0, rank: 4,                 logoUrl: '/logos/viper.jpg'         },
    ],
  },
  {
    _id: 'g4', name: 'Bảng D',
    teams: MOCK_TEAMS.filter(t => t.groupId === 'g4'),
    standings: [
      { teamId: 't13', teamName: 'Black Panther', teamTag: 'BKP', wins: 3, losses: 0, goalDiff: 7,  points: 9, rank: 1, advance: true,  logoUrl: '/logos/black_panther.jpg' },
      { teamId: 't14', teamName: 'Dead Game',     teamTag: 'DGM', wins: 2, losses: 1, goalDiff: 2,  points: 6, rank: 2, advance: true,  logoUrl: '/logos/deadgame.jpg'      },
      { teamId: 't15', teamName: 'Frost',         teamTag: 'FRS', wins: 1, losses: 2, goalDiff: -3, points: 3, rank: 3,                 logoUrl: '/logos/frost.jpg'         },
      { teamId: 't16', teamName: 'Valkyrie',      teamTag: 'VLK', wins: 0, losses: 3, goalDiff: -6, points: 0, rank: 4,                 logoUrl: '/logos/valkyrie.jpg'      },
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
