import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany, JoinTable, ManyToMany} from "typeorm";
import { Reportes } from "src/reportes/entitys/reportes.entity";
import { User } from "src/users/entitiys/user.entity";
import { Parte } from "./parte.entity";

@Entity({name:'parte_imagen'})
export class ParteImagen {
    @PrimaryGeneratedColumn()
    idParteImagen: number
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
    parteId: number

    @Column({nullable:true})
    userId: number
    
    @ManyToOne(()=>User,user=>user.idUsuario)
    user:User

    @ManyToOne(()=>Parte,obs=>obs.partesImagen)
    @JoinTable()
    parte:Parte

}
