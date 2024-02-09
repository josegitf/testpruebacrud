import { Component } from '@angular/core';
import { FormGroup, FormControl,Validators,FormBuilder } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';
/**importamos toast para mostrar mensajes */
import { ToastrService } from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.css']
})
export class NewpostComponent {
  imgperfil: File | null = null;

  datapost:any
  registrarPost: FormGroup;
  tipocontenido:boolean=false
  constructor(
    public userService: UsersService,
    private postServicio: PostService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ){
    /**
     * FORMULARIO DE REGISTRO PARA NUESTRO NUEVO POST
     * uso de form group y formcontrol para obtener los datos que ingresa el usuario
     * el archivo de la imagen sera enviado en un input diferente
     */
    this.registrarPost = this.formBuilder.group(
      { 
        title: ['', Validators.required],
        body: ['', Validators.required],
        estado: [true],
        img: ['', Validators.required],
        adultos: [false]
      }
    );
  }
  ngOnInit() {
    // Obtener los datos de la publicación del servicio al inicializar el componente
    this.datapost = this.postServicio.getData();
  }
  /**necesario para cambiar de imagen */
  onFileSelected(event:any){
    this.imgperfil = event.target.files[0];
  }
  /**si el contenido es publico el usuario debe elegir si el contenido es apropiado para niños */
  contenidoinput(){
    if (this.registrarPost.value.estado != true) {      
      this.tipocontenido = true
      this.registrarPost.patchValue({
        adultos:false
      });
    }else{
      this.tipocontenido = false
    }
  }
  /** funcion para guardar el nuevo post.
   * pasaremos la informacion del post al servicio (postServicio) para guardarlo ahi
   * antes de enviar los datos al back se realiza la validacion
   */
  savepost(){
    if (this.registrarPost.valid) {
      if (!this.imgperfil) {
        this.toastr.error('No se ha seleccionado ninguna imagen.', 'info!');
        return;
      }
      this.postServicio.savepost(this.imgperfil,this.registrarPost.value).subscribe({
        next:(respuesta)=>{
          // Actualizar los datos de la tabla publicación en el servicio y cerrar nuestro modal
          this.postServicio.reloadData();
          this.closeModaldialog()
          this.toastr.success(respuesta.mensaje, 'EXITO');
        },
        error:(error)=>{
          console.error(error);
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
