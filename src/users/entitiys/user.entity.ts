import { TrabajadoresHotel } from "src/hoteles/entitys/trabajador-hotel.entity";
import { Reportes } from "src/reportes/entitys/reportes.entity";
import { Entity,Column,PrimaryGeneratedColumn,OneToOne ,JoinColumn ,OneToMany} from "typeorm";
import { Perfil } from "./perfil.entity";

@Entity({name:'usuarios'})
export class User {
    @PrimaryGeneratedColumn()
    idUsuario: number
    @Column()
    nombre: string
    @Column({unique:true}) 
    correo: string
    @Column()
    clave: string
    @Column({default: '1'})
    esActivo: string

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date

    @OneToMany(()=>Reportes,reporte=>reporte.usuario)
    reportes:Reportes[]

    @OneToMany(()=>TrabajadoresHotel,reporte=>reporte.user)
    trabajos:TrabajadoresHotel[]

    @OneToOne(() => Perfil)
    @JoinColumn()
    perfil: Perfil
}
