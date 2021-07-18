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

  squares: any[] = [];
  public currentPlayer: Player = null;
  winner: Player = null;

  human: 'X' = 'X';
  agent: 'O' = 'O';
  bestPlay: number = -Infinity;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
    this.humanMove(index);
    this.currentPlayer = this.agent;

    // agent moves
    if (this.winner === null) {
      this.agentMove();
      this.currentPlayer = this.human;
    }


    // minimax
    let play = this.minimax(this.currentPlayer);


  }

  private humanMove(index: number) {
    if (!this.squares[index]) {
      this.squares.splice(index, 1, this.human);
    }
    this.checkWinner(this.human);
  }

  private agentMove() {
    let allPossibleMoves = this.allPossibleMoves();
    let move = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
    this.squares.splice(move, 1, this.agent);
    this.checkWinner(this.agent);
  }


  private allPossibleMoves(): any[] {
    let moves: any[] = [];
    this.squares.forEach((square, index) => {
      if (square === null)
        moves.push(index);
    })
    return moves;
  }



  private checkWinner(player: Player) {
    if (
      (this.squares[0] === player && this.squares[1] === player && this.squares[2] === player) ||
      (this.squares[3] === player && this.squares[4] === player && this.squares[5] === player) ||
      (this.squares[6] === player && this.squares[7] === player && this.squares[8] === player) ||
      (this.squares[0] === player && this.squares[3] === player && this.squares[6] === player) ||
      (this.squares[1] === player && this.squares[4] === player && this.squares[7] === player) ||
      (this.squares[2] === player && this.squares[5] === player && this.squares[8] === player) ||
      (this.squares[0] === player && this.squares[4] === player && this.squares[8] === player) ||
      (this.squares[2] === player && this.squares[4] === player && this.squares[6] === player)
    ) {
      this.winner = player;
      this.openDialog(this.winner);
    } else {
      if (this.squares.every(square => square !== null)) this.openDialog(null);
    }

  }

  private minimax(player: Player) {

    return null;
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
