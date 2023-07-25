import { Reportes } from "src/reportes/entitys/reportes.entity";
import { Entity,Column,PrimaryGeneratedColumn,
    OneToOne ,JoinColumn ,OneToMany,ManyToOne, JoinTable} from "typeorm";
import { ObservacionImagen } from "./observacion-imagen.entity";
import { ObservacionComentario } from "./observacion-comentario.entity";



@Entity({name:'observacion'})
export class Observacion {
    @PrimaryGeneratedColumn()
    idObservacion: number
    @Column()
    equipo: string
    @Column()
    marca: string
    @Column()
    modelo: string
    @Column()
    numeroSerie: string
    @Column()
    area: string
    @Column()
    observacion:string;
    @Column()
    criticidad:string; 
    @Column({default: '1'})
    esActivo: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date

    @Column({nullable:true}) /*nullable sirve para poder decir que puede ser null */
    reporteId: number

    @Column({nullable:true})
    userId: number


    @ManyToOne(()=>Reportes,report=>report.observaciones)
    @JoinTable()
    reporte:Reportes

    @OneToMany(()=>ObservacionImagen,observa=>observa.observacion)
    observacionesImagen:ObservacionImagen[]

    @OneToMany(()=>ObservacionComentario,observa=>observa.observacion)
    observacionesComentario:ObservacionComentario[]

    
}
