import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface WinnerDialogData {
  winner: 'X' | 'O';
}

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './winner-dialog.component.html',
  styleUrls: ['./winner-dialog.component.css']
})
export class WinnerDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WinnerDialogData,
    public dialogRef: MatDialogRef<WinnerDialogComponent>) { }

  ngOnInit(): void {
  }

  public onNewGameClick() {
    let restart: boolean = true;
    this.dialogRef.close({ data: restart });
  }

}
