import { join } from "path";
import { Hoteles } from "src/hoteles/entitys/hotel.entity";
import { Observacion } from "src/observaciones/entitys/observacion.entity";
import { FirmasReporte } from "src/reportes/entitys/firmas-reporte.entity";
import { User } from "src/users/entitiys/user.entity";
import { Entity,Column,PrimaryGeneratedColumn,
    OneToOne ,JoinColumn ,OneToMany,ManyToOne, JoinTable, ManyToMany} from "typeorm";

@Entity({name:'reportes'})
export class Reportes {
    @PrimaryGeneratedColumn()
    idReporte: number
    @Column({nullable:true})
    recomendaciones: string
    @Column({nullable:true})
    descripcion: string

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


    // @OneToOne(()=>Hoteles)
    // @JoinColumn()
    // hoteles:hoteles
    @ManyToOne(()=>Hoteles,user=>user.reportes)
    hoteles:Hoteles

    
    @ManyToOne(()=>User,user=>user.reportes)
    usuario:User

    @OneToMany(()=>Observacion,(observa)=>observa.reporte)
    @JoinTable({ 
        name: 'observacion_imagen',
        joinColumn: { name: 'idObservacion' },
        inverseJoinColumn: { name: 'idObservacionImagen' }
    })
    observaciones:Observacion[]

    @OneToMany(()=>FirmasReporte,firma=>firma.reporteF)
    firmasReporte:FirmasReporte[]


}
