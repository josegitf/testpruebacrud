import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl,Validators,FormBuilder } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';
/**importamos toast para mostrar mensajes */
import { ToastrService } from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.css']
})
export class EditpostComponent {
  editarPost: FormGroup;
  tipocontenido:boolean=false

  constructor(
    public userService: UsersService,
    private postServicio: PostService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { postId: any }
  ){
    /**
     * FORMULARIO DE REGISTRO PARA NUESTRO NUEVO POST
     * uso de form group y formcontrol para obtener los datos que ingresa el usuario
     * el archivo de la imagen sera enviado en un input diferente
     */
    this.editarPost = this.formBuilder.group(
      { 
        id:this.data.postId,
        title: ['', Validators.required],
        body: ['', Validators.required],
        estado: [true],
        adultos: [false]
      }
    );
  }
  ngOnInit(): void {
    this.datapost()
  }
  /** Cargar los datos del post con el ID que se envia desde listado */
  datapost(){
    this.postServicio.datapost(this.data.postId).subscribe({
      next:(response)=>{
        this.editarPost.patchValue({
          title:response.title,
          body:response.body,
          estado:response.estado,
          adultos:response.adultos
        });
        this.contenidoinput()
      },
      error:(error)=>{
        console.log(error);
        this.toastr.error('Ocurrio un error vuelva a intentarlo.', 'info!');
      }
    })
  }
  /**si el contenido es publico el usuario debe elegir si el contenido es apropiado para niños */
  contenidoinput(){
    if (this.editarPost.value.estado != true) {      
      this.tipocontenido = true
      this.editarPost.patchValue({
        adultos:false
      });
    }else{
      this.tipocontenido = false
    }
  }
  savepostedit(){
    if (this.editarPost.valid) {
      this.postServicio.savepostedit(this.editarPost.value).subscribe({
        next:(response)=>{
          /** una vez guardada la nueva data tambien se recarga la tabla de los posts y cerrar el dialog */
          this.postServicio.reloadData();
          this.closeModaldialog()
          this.toastr.success(response.mensaje, 'EXITO');
        },
        error:(error)=>{
          console.log(error);
          this.toastr.error('Ocurrio un error vuelva a intentarlo, si persiste comuniquese con el departamento de desarrollo', 'info!');
        }
      })
    }else{
      this.toastr.warning('¡Es necesario rellenar todos los campos!', 'INFO');
    }
  }
  closeModaldialog(){
    this.dialog.closeAll();
  }
}
