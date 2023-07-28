import { TrabajadoresHotel } from "src/hoteles/entitys/trabajador-hotel.entity";
import { Reportes } from "src/reportes/entitys/reportes.entity";
import { Entity,Column,PrimaryGeneratedColumn,OneToOne ,JoinColumn ,OneToMany} from "typeorm";
import { User } from "./user.entity";

@Entity({name:'perfil'})
export class Perfil {
    @PrimaryGeneratedColumn()
    idUsuarioPerfil: number
    @Column()
    nombre: string
    @Column({nullable:true}) 
    path: string
    @Column({nullable:true})
    tipoArchivo: string
    @Column({nullable:true})
    nombreArchivo: string
    @Column({nullable:true})
    url: string
    @Column({default: '1'})
    esActivo: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date
    
    @OneToOne(() => User, (user) => user.perfil) // specify inverse side as a second parameter
    user: User
    
}
