import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewpostComponent } from 'src/app/components/newpost/newpost.component';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  dialogRef: MatDialogRef<NewpostComponent> | undefined;

  constructor(public dialog: MatDialog,private postServicio:PostService) {

  }
  ngOnInit() {

  }
  
  /** USAR DIALOG DE ANGULAR MATERIAL
   * El boton ejecuta openmodal y abre al componente importado que contiene el dialog
   */
  openModaldialog() {
    this.dialogRef = this.dialog.open(NewpostComponent);
  }

}
