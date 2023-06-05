import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entitiys/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    

    constructor(
        @InjectRepository(User) private userRepositorio:Repository<User>,
        ){
        
    }

   async createUser(user:createUserDto){
        const userFound = await this.userRepositorio.findOne({
            where:{
                correo:user.correo
            }
        })

        if (userFound) {
            return new HttpException('Usuario ya existe',HttpStatus.CONFLICT)
        }

        const newUser = this.userRepositorio.create(user)
        return this.userRepositorio.save(newUser)
    }

    listarUsuario(){
        return this.userRepositorio.find({
            relations:['trabajos']
        });
    }
    
    async listarUsuarioPorID(id: number){
        console.log('Entro', id);
        
        const userFound  = await this.userRepositorio.findOne({
            where:{
                idUsuario:id,
            },
            // relations:['posts']

        })
        console.log(userFound);
        
        if (!userFound) {
            return new HttpException('Usuario no exontrado',HttpStatus.NOT_FOUND)
        }else{
            return userFound;

        }
    }

    async listarUsuarioPorIdSinException(id: number){
        const userFound  = await this.userRepositorio.findOne({
            where:{
                idUsuario:id,
            },
            // relations:['posts']

        })

            return userFound;
        
    }

    async eliminarUsuario(id: number){
        const result =await this.userRepositorio.delete({idUsuario:id});
        if (result.affected === 0) {
            return new HttpException('Usuario no exontrado',HttpStatus.NOT_FOUND)
        }else{
            return result
        }

        // const userFound = await  this.userRepositorio.findOne({
        //     where:{
        //         id:id
        //     }
        // })

        // if (!userFound) {
        //     return new HttpException('Usuario no exontrado',HttpStatus.NOT_FOUND)
        // }else{
        //     return this.userRepositorio.delete({id});
        // }

        
    }

   async updateUsusario(id:number, user:updateUserDto){
        const userFound  = await this.userRepositorio.findOne({
            where:{
                idUsuario:id
            }
        })
        if (!userFound) {
            return new HttpException('Usuario no exontrado',HttpStatus.NOT_FOUND)
        }else{
            const updateUser = Object.assign(userFound,user)
            return this.userRepositorio.save(updateUser)

        }

  
        // return this.userRepositorio.update({id},user)

    }

}
