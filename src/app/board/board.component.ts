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

  private human: 'X' = 'X';
  private agent: 'O' = 'O';
  private currentPlayer: Player = null;
  private winner: Player = null;

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
  }

  public makeMove(index: number): void {
    // human moves
    this.move(index, this.human);
    this.currentPlayer = this.agent;

    // agent moves
    if (this.winner === null) {
      // calculate move
      let board: any[] = this.squares.slice();
      let move = this.minimax(board, this.agent);
      this.move(move, this.agent);
      this.currentPlayer = this.human;
    }
  }


  private move(index: number, player: Player) {
    if (!this.squares[index]) {
      this.squares.splice(index, 1, player);
    }
    if (this.checkWinner(this.squares, player)) {
      this.winner = player;
      this.openDialog(player);
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


  private allPossibleSquares(squares: any[], player: Player): any[][] {
    let possibleSquares: any[][] = [];
    let moves: any[] = this.allPossibleMoves(squares);
    moves.forEach(move => {
      let possible: any[] = squares.slice();
      possible[move] = player;
      possibleSquares.push(possible);
    })
    return possibleSquares;
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
    } else if (this.squares.every(square => square !== null)) {
      // draw
      return null;
    }
    else {
      // no winner
      return false;
    }
  }


  private heuristicEvaluate(result: boolean | null, player: Player): number {
    let score: number = 0;
    if (result && player === this.agent)
      score = 1;
    else if (result && player === this.human)
      score = -1;
    return score;
  }

  /**
   * 
   * @param squares possible square moves
   * @param player current player
   * @returns move
   */
  private minimax(squares: any[], player: Player): number {
    // game is complete
    let result = this.checkWinner(squares, this.agent) || this.checkWinner(squares, this.human);
    if (result || result === null)
      return this.heuristicEvaluate(result, player);

    if (player === this.agent) { // maximize
      let maxScore = -Infinity;
      let possibleSquares: any[][] = this.allPossibleSquares(squares, player);
      possibleSquares.forEach(possibleSquare => {
        maxScore = Math.max(maxScore, this.minimax(possibleSquare, this.human));
      })
      return maxScore;

    } else { // minimize
      let maxScore = +Infinity;
      let possibleSquares: any[][] = this.allPossibleSquares(squares, player);
      possibleSquares.forEach(possibleSquare => {
        maxScore = Math.max(maxScore, this.minimax(possibleSquare, this.agent));
      })
      return maxScore;
    }
  }


  private openDialog(winner: Player) {

    const data: WinnerDialogData = { winner: winner }
    const dialogRef = this.dialog.open(WinnerDialogComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.data}`);
      if (result.data === true) this.newGame();
    });
  }
}