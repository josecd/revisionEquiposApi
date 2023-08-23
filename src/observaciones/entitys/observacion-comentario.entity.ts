import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany, JoinTable, ManyToMany} from "typeorm";
import { Observacion } from "./observacion.entity";
import { Reportes } from "src/reportes/entitys/reportes.entity";
import { User } from "src/users/entitiys/user.entity";

@Entity({name:'observacion_comentario'})
export class ObservacionComentario {
    @PrimaryGeneratedColumn()
    idObservacionComentario: number
    @Column({length: 2500,nullable:true})
    comentario: string

    @Column()
    dateString: string

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'},) 
    fechaRegistro: Date

    
    @Column({default: '1'})
    esActivo: string

    @Column({nullable:true})
    userId: number

    @Column({nullable:true}) /*nullable sirve para poder decir que puede ser null */
    observacionId: number
    
    @ManyToOne(()=>User,user=>user.idUsuario)
    user:User


    @ManyToOne(()=>Observacion,obs=>obs.observacionesComentario)
    @JoinTable()
    observacion:Observacion

}
