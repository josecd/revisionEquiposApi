import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany} from "typeorm";
import { Hoteles } from "./hotel.entity";
import { User } from "src/users/entitiys/user.entity";

@Entity({name:'trabajadores_hotel'})
export class TrabajadoresHotel {
    @PrimaryGeneratedColumn()
    idTrabajadoresHotel: number
    @Column()
    puesto: string
    @Column({default: '1'})
    esActivo: string
    @Column({default: '1'})
    estado: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date

    @Column({nullable:true})
    hotelId: number

    @Column({nullable:true})
    userId: number

    @ManyToOne(()=>Hoteles,user=>user.trabajadores)
    hotel:Hoteles

    @ManyToOne(()=>User,user=>user.trabajos)
    user:User
}
