import { Reportes } from "src/reportes/entitys/reportes.entity";
import { Entity,Column,PrimaryGeneratedColumn,
    OneToOne ,JoinColumn ,OneToMany,ManyToOne, JoinTable} from "typeorm";
import { ObservacionImagen } from "./observacion-imagen.entity";
import { ObservacionComentario } from "./observacion-comentario.entity";



@Entity({name:'observacion'})
export class Observacion {
    @PrimaryGeneratedColumn()
    idObservacion: number
    @Column({nullable:true})
    identificador: number
    @Column({nullable:true})
    equipo: string
    @Column({nullable:true})
    marca: string
    @Column({nullable:true})
    modelo: string
    @Column({nullable:true})
    numeroSerie: string
    @Column({nullable:true})
    area: string
    @Column({length: 2500, nullable:true})
    observacion:string;
    @Column({nullable:true})
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

    @Column({nullable:true})
    tipoReporte: string

    ///Baja
    @Column({nullable:true})
    adquisicionEquipo: string

    @Column({nullable:true}) //igual sirve para MP&MC
    ubicacion: string

    @Column({nullable:true})
    oc: string

    @Column({nullable:true})
    sapID: string

    @Column({length: 2500, nullable:true}) //igual sirve para MP&MC
    diagnosticoTecnico: string

    @Column({length: 2500, nullable:true})
    motivoDanio: string


    /// MTT P&C
    @Column({nullable:true})
    fechaInicio: string

    @Column({nullable:true})
    fechaFinaliza: string

    @Column({nullable:true})
    tecEsp: string

    @Column({length: 2500, nullable:true})
    fallaDetectadaDuraSer: string

    @Column({length: 2500, nullable:true})
    comentariosEntregaEquip: string



  

}
