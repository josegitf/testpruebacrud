import { Component,Inject,Input  } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-confirmaciondialog',
  templateUrl: './confirmaciondialog.component.html',
  styleUrls: ['./confirmaciondialog.component.css'],
})
export class ConfirmaciondialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmaciondialogComponent>,
    public postServicio: PostService,
    /** vamos a guardar el id que nos estan enviado desde otro componente para poder retornarlo despues una vez
     * que el usuario confirme
     */
    @Inject(MAT_DIALOG_DATA) public data: { postId: any }
  ){

  }
  /** al confirmar enviamos el id previamente obtenido y lo regresamos, cerramos el dialog*/
  confirmo(){
    const postId = this.data.postId;
    this.postServicio.confirmarEliminacion(postId);    
    this.dialogRef.close();
  }
}
