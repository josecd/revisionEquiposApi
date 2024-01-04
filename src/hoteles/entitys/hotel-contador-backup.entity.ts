import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany, JoinTable, ManyToMany} from "typeorm";


@Entity({name:'hotel_contador_backup'})
export class hotelContadorBackup {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    idHotel: number
    @Column()
    nombre: string
    @Column({nullable:true})
    contador: number
    @Column({default: '1'})
    esActivo: string
    @Column({default: '1'})
    estado: string
    @Column()
    mes: string
    @Column()
    anio: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date
}
