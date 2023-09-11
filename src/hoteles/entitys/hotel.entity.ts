import { Entity,Column,PrimaryGeneratedColumn,OneToOne ,JoinColumn ,OneToMany} from "typeorm";
import { TrabajadoresHotel } from "./trabajador-hotel.entity";
import { Reportes } from "src/reportes/entitys/reportes.entity";

@Entity({name:'hoteles'})
export class Hoteles {
    @PrimaryGeneratedColumn()
    idHotel: number
    @Column()
    nombre: string
    @Column({nullable:true})
    contador: number
    @Column({default: '1'})
    esActivo: string
    @Column({default: '1'})
    estado: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date
    @OneToMany(()=>TrabajadoresHotel,trabaja=>trabaja.hotel)
    trabajadores:TrabajadoresHotel[]
    @OneToMany(()=>Reportes,reporte=>reporte.hoteles)
    reportes:Reportes[]
    
}
