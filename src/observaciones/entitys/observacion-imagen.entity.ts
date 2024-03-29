import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany, JoinTable, ManyToMany} from "typeorm";
import { Observacion } from "./observacion.entity";
import { Reportes } from "src/reportes/entitys/reportes.entity";
import { User } from "src/users/entitiys/user.entity";

@Entity({name:'observacion_imagen'})
export class ObservacionImagen {
    @PrimaryGeneratedColumn()
    idObservacionImagen: number
    @Column()
    url: string
    @Column()
    nombreArchivo: string
    @Column({default: '1'})
    esActivo: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date
    @Column()
    tipoArchivo: string
    @Column()
    path: string
    @Column({nullable:true}) /*nullable sirve para poder decir que puede ser null */
    observacionId: number
    @Column({nullable:true})
    userId: number
    @ManyToOne(()=>User,user=>user.idUsuario)
    user:User
    @ManyToOne(()=>Observacion,obs=>obs.observacionesImagen)
    @JoinTable()
    observacion:Observacion

}
