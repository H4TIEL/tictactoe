import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../board/board.component';

export interface WinnerDialogData {
  winner: Player;
}

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './winner-dialog.component.html',
  styleUrls: ['./winner-dialog.component.css']
})
export class WinnerDialogComponent implements OnInit {

  public results: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WinnerDialogData,
    public dialogRef: MatDialogRef<WinnerDialogComponent>) { }

  ngOnInit(): void {
    this.results = this.data.winner !== null ? `${this.data.winner} wins` : 'Draw';
  }

  public onNewGameClick() {
    let restart: boolean = true;
    this.dialogRef.close({ data: restart });
  }

}
