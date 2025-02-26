import { 
  type Tournament, 
  type InsertTournament,
  type Player,
  type InsertPlayer
} from "@shared/schema";

export interface IStorage {
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  getTournament(id: number): Promise<Tournament | undefined>;
  getPlayer(id: number): Promise<Player | undefined>;
}

export class MemStorage implements IStorage {
  private tournaments: Map<number, Tournament>;
  private players: Map<number, Player>;
  private tournamentId: number;
  private playerId: number;

  constructor() {
    this.tournaments = new Map();
    this.players = new Map();
    this.tournamentId = 1;
    this.playerId = 1;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.tournamentId++;
    const newTournament = { 
      ...tournament, 
      id,
      firstPlaceId: null,
      secondPlaceId: null,
      thirdPlaceId: null
    };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.playerId++;
    const newPlayer = { ...player, id };
    this.players.set(id, newPlayer);
    return newPlayer;
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
}

export const storage = new MemStorage();
