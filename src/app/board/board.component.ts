import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WinnerDialogComponent, WinnerDialogData } from '../winner-dialog/winner-dialog.component';

export type Player = 'X' | 'O' | null;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  private human: Player = 'X';
  private agent: Player = 'O';
  private currentPlayer: Player = null;
  private winner: Player = null;
  private gameOver: boolean = false;

  public squares: any[] = [];

  constructor(public dialog: MatDialog) { }


  public ngOnInit(): void {
    this.newGame();
  }


  public get player() {
    return this.currentPlayer;
  }


  public newGame(): void {
    this.squares = Array(9).fill(null);
    this.currentPlayer = this.human;
    this.winner = null;
    this.gameOver = false;
  }


  public makeMove(index: number): void {
    // human moves
    this.move(index, this.human);


    // agent moves
    if (!this.gameOver && this.currentPlayer == this.agent) {
      // calculate move
      let scores: number[] = [];
      let moves: any[] = this.allPossibleMoves(this.squares);

      moves.forEach(move => {
        let board: any[] = this.squares.slice();
        board.splice(move, 1, this.agent);
        let score = this.minimax(board, -Infinity, +Infinity, this.human);
        scores.push(score);
      })

      let move: number = scores.indexOf(Math.max(...scores));
      this.move(moves[move], this.agent);
    }
  }


  private move(index: number, player: Player) {
    // make move if sqaure is empty
    if (!this.squares[index]) {
      this.squares.splice(index, 1, player);
      this.currentPlayer = player === this.agent ? this.human : this.agent;

      let state = this.checkWinner(this.squares, player);
      if (state) {
        // winner
        this.winner = player;
        this.gameOver = true;
        this.openDialog(this.winner);
      } else if (state === null) {
        // draw
        this.winner = null;
        this.gameOver = true;
        this.openDialog(this.winner);
      }
    }
  }


  private allPossibleMoves(squares: any[]): any[] {
    let moves: any[] = [];
    squares.forEach((square, index) => {
      if (square === null)
        moves.push(index);
    })
    return moves;
  }


  private checkWinner(squares: any[], player: Player): boolean | null {
    if (
      (squares[0] === player && squares[1] === player && squares[2] === player) ||
      (squares[3] === player && squares[4] === player && squares[5] === player) ||
      (squares[6] === player && squares[7] === player && squares[8] === player) ||
      (squares[0] === player && squares[3] === player && squares[6] === player) ||
      (squares[1] === player && squares[4] === player && squares[7] === player) ||
      (squares[2] === player && squares[5] === player && squares[8] === player) ||
      (squares[0] === player && squares[4] === player && squares[8] === player) ||
      (squares[2] === player && squares[4] === player && squares[6] === player)
    ) {
      // player won
      return true;
    } else if (squares.every(square => square !== null)) {
      // draw
      return null;
    }
    else {
      // no winner
      return false;
    }
  }


  private heuristicEvaluate(result: boolean | null, player: Player): number {
    if (result && player === this.agent)
      return 1;
    else if (result && player === this.human)
      return -1;
    else
      return 0;
  }

  /**
   * 
   * @param squares board
   * @param player current player
   * @param alpha 
   * @param beta 
   * @returns score for board
   */
  private minimax(squares: any[], alpha: number, beta: number, player: Player): number {
    // game is complete
    let result = this.checkWinner(squares, this.agent) || this.checkWinner(squares, this.human);
    if (result || result === null) {
      let lastPlayer = player === this.agent ? this.human : this.agent;
      return this.heuristicEvaluate(result, lastPlayer);
    }

    if (player === this.agent) { // maximize
      let score = -Infinity;
      let moves: number[] = this.allPossibleMoves(squares);
      for (let move of moves) {
        let board: any[] = squares.slice();
        board.splice(move, 1, this.agent);
        let evaluation = this.minimax(board, alpha, beta, this.human);
        score = Math.max(score, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha)
          break;
      }
      return score;

    } else { // minimize
      let score = +Infinity;
      let moves: number[] = this.allPossibleMoves(squares);
      for (let move of moves) {
        let board: any[] = squares.slice();
        board.splice(move, 1, this.human);
        let evaluation = this.minimax(board, alpha, beta, this.agent);
        score = Math.min(score, evaluation);
        beta = Math.min(beta, evaluation)
        if (beta <= alpha)
          break;
      }
      return score;
    }
  }


  private openDialog(winner: Player) {
    const data: WinnerDialogData = { winner: winner }
    const dialogRef = this.dialog.open(WinnerDialogComponent, { data });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === true) this.newGame();
    });
  }
}