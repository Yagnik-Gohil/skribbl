type WORD_MODE = "normal" | "hidden" | "both";
type STATUS = "live" | "lobby" | "word-selection";
export interface IUser {
  id: string;
  room: string;
  admin: boolean;
  name: string;
  emoji: string;
  score: number;
}
export interface IConfiguration {
  room: string;
  drawTime: number;
  hints: number;
  rounds: number;
  wordCount: number;
  wordMode: WORD_MODE;
}
export interface IWordSelected {
  currentTurn: IUser;
  word: string;
}
export interface IGameState {
  status: STATUS;
  players: string[]; // Array of clientIds
  currentTurn: number;
  word: string;
  drawTime: number;
  rounds: number;
  currentRound: number;
  wordMode: WORD_MODE;
  wordCount: number;
  hints: number;
}

export interface IWordSelection {
  currentTurn: IUser;
  gameState: IGameState;
  list: string[];
}

export interface IJoined {
  user: IUser;
  members: IUser[];
  gameState: IGameState;
  currentTurn: IUser;
}

export interface ILeft {
  user: IUser;
  members: IUser[];
  gameState: IGameState;
  currentTurn: IUser;
}

export interface IDatabase {
  "1": string[];
  "2": string[];
  "3": string[];
}
