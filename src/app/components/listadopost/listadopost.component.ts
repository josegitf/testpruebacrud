import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription,BehaviorSubject  } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmaciondialogComponent } from '../confirmaciondialog/confirmaciondialog.component';
import { EditpostComponent } from '../editpost/editpost.component';
/**
 * importar la tabla y el paginador 
 */
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environment.local';

@Component({
  selector: 'app-listadopost',
  templateUrl: './listadopost.component.html',
  styleUrls: ['./listadopost.component.css']
})
export class ListadopostComponent {
    /**el paginator esta indefinido por que se genera un error al iniciarlo 
   * lo vemos despues en el constructor con la asignacion
   * al igual que dataSource, esta variable va almacenar la data del servicio para poder asignarla a nuestra
   * tabla posteriomente
  */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<any>;
  dataposts:any
  /**las columnas de la tabla, la immagen no se renderiza por que faltan algunas configuraciones en el back */
  columnsToDisplay = ['id', 'titulo','estado','imagen','editar','eliminar'];
  apiUrl: string = environment.apiUrl;
  confirmacionSubscription: Subscription | undefined;
  
  /** filtros */
  filtroEstado:string=""
  filtrotitle:string=""


  constructor(
    private postServicio: PostService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ){
    this.paginator = {} as MatPaginator;
    this.dataSource = new MatTableDataSource<any>();
  }
  ngOnInit(): void {
    /**obtener la data cuando se inicie nuestro componente */
    this.getposts()
    /**creamos una suscripcion a updatepost para poder ejecutar la funcion desde el servicio
     * esto nos permitira actualizar la tabla
     */
    this.postServicio.postUpdated.subscribe(() => {
      /**funcion que se ejecuta para actualizar */
      this.getposts()
    });

    /** aqui estamos suscritos al componente del dialog confirmacion el cual recibe el id que quiero eliminar
     * despues me lo regresa y ejecuto la funcion de eliminar una vez confirmado
     */
    this.confirmacionSubscription = this.postServicio.confirmacion$.subscribe(
      (id: number) => {
      this.eliminarpost(id)
     }
    );

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getposts(){
    this.postServicio.getpublicaciones().subscribe({
      next:(data)=>{
        /** el back retorna el estado en 1 ó 0 por que es un valor bolean entonces se cambia el valor */
        const newData = data.map((item: { estado: number; }) => ({
          ...item,
          estado: item.estado === 1 ? 'Publico' : 'Privado'
        }));
        this.dataSource = new MatTableDataSource<any>(newData);
        this.dataSource.paginator = this.paginator;
      },
      error:(error)=>{
        console.error(error.error)
      }
    })
  }
  eliminarpost(id:any){
    this.postServicio.eliminarpost(id).subscribe({
      next:(respuesta)=>{
        this.toastr.success(respuesta.mensaje, 'EXITO');
        /** recargamos la data despues de eliminar el post */
        this.getposts()
      },
      error:(error)=>{
        console.log(error);
        this.toastr.error('Ocurrio un error vuelva a intentarlo.', 'info!');
      }
    })
  }
  /** abrimos el dialog o modal y pasamos el id del item o post que queremos eliminar posteriormente nos retorna este mismo id*/
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string,id:any): void {
    this.dialog.open(ConfirmaciondialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { postId: id } 
    });
  }
  /** enviar el id al dialog para poder buscar su informacion y abrimos el dialog*/
  openDialogEdit(enterAnimationDuration: string, exitAnimationDuration: string,id:any): void {
    this.dialog.open(EditpostComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      data: { postId: id } 
    });
  }
  filtrocambiotitulo(){
    this.dataSource.filter = this.filtrotitle.trim().toLowerCase();
  }
  filtrocambioestado(){
    this.dataSource.filter = this.filtroEstado.trim().toLowerCase();
  }
}
