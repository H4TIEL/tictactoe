import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WinnerDialogComponent, WinnerDialogData } from '../winner-dialog/winner-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  squares: any[] = [];
  xIsNext: boolean = false;
  winner: 'X' | 'O' | null = null;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
  }

  public get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  public newGame(): void {
    this.squares = Array(9).fill(null);
    this.xIsNext = true;
    this.winner = null;
  }


  public makeMove(index: number): void {
    if (!this.squares[index]) {
      this.squares.splice(index, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
    if(this.winner !== null) this.openDialog(this.winner);
    
  }

  private calculateWinner(): 'X' | 'O' | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }

  private openDialog(winner: 'X' | 'O') {

    const data: WinnerDialogData = { winner: winner }
    const dialogRef = this.dialog.open(WinnerDialogComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.data}`);
      if(result.data === true) this.newGame();
    });
  }
}
