export interface IUser {
    id: string;
    room: string;
    admin: boolean;
    name: string;
    emoji: string;
}
type WORD_MODE = "normal" | "hidden" | "both";
export interface IConfiguration {
    room: string;
    isGameStarted: boolean;
    drawTime: number;
    hints: number;
    rounds: number;
    wordCount: number;
    wordMode: WORD_MODE;
  }