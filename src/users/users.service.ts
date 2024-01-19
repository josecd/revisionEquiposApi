import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entitiys/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { Perfil } from './entitiys/perfil.entity';
import { createPerfilDto } from './dto/create-perfil.dto';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import { OpenaiService } from 'src/services/openai/openai.service';

@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User) private userRepositorio: Repository<User>,
        @InjectRepository(Perfil) private userPerfil: Repository<Perfil>,
        private _up: UploadFileS3Service,
        private _openai: OpenaiService
    ) {

    }

    async createUser(user: createUserDto) {
        const userFound = await this.userRepositorio.findOne({
            where: {
                correo: user.correo
            }
        })

        if (userFound) {
            return new HttpException('Usuario ya existe', HttpStatus.CONFLICT)
        }

        const newUser = this.userRepositorio.create(user)
        return this.userRepositorio.save(newUser)
    }

    listarUsuario() {
        return this.userRepositorio.find({
            relations: ['trabajos']
        });
    }

    async listarUsuarioPorID(id: number) {
        const userFound = await this.userRepositorio.findOne({
            where: {
                idUsuario: id,
            },
            relations: ['perfil']

        })
        // console.log(userFound);

        if (!userFound) {
            return new HttpException('Perfil no exontrado', HttpStatus.NOT_FOUND)
        } else {
            return userFound;
        }
    }

    async listarPerfiloPorID(id: number) {
        // console.log('Entro', id);

        const userFound = await this.userRepositorio.findOne({
            where: {
                idUsuario: id,
            },
            relations: ['perfil']

        })
        // console.log(userFound);

        if (!userFound) {
            return new HttpException('Usuario no exontrado', HttpStatus.NOT_FOUND)
        } else {
            return {
                idUsuario: userFound.idUsuario,
                nombre: userFound.nombre,
                correo: userFound.correo,
                perfil: userFound.perfil,
            }

        }
    }


    async listarUsuarioPorIdSinException(id: number) {
        const userFound = await this.userRepositorio.findOne({
            where: {
                idUsuario: id,
            },
            // relations:['posts']

        })

        return userFound;

    }

    async eliminarUsuario(id: number) {
        const result = await this.userRepositorio.delete({ idUsuario: id });
        if (result.affected === 0) {
            return new HttpException('Usuario no exontrado', HttpStatus.NOT_FOUND)
        } else {
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

    async updateUsusario(id: number, user: updateUserDto) {
        const userFound = await this.userRepositorio.findOne({
            where: {
                idUsuario: id
            }
        })
        if (!userFound) {
            return new HttpException('Usuario no exontrado', HttpStatus.NOT_FOUND)
        } else {
            const updateUser = Object.assign(userFound, user)
            return this.userRepositorio.save(updateUser)

        }
        // return this.userRepositorio.update({id},user)

    }

    async signIn(correo: string, pass: string): Promise<any> {
        const user = await this.userRepositorio.findOne({
            where: {
                correo: correo,
                clave: pass
            },
            // relations:['posts']

        })
        if (user?.clave !== pass) {
            throw new UnauthorizedException();
        }
        const { clave, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object
        return result;
    }


    async createFirmaUsuario(id: number, pefil: createPerfilDto, file) {
        const userFound = await this.userRepositorio.findOne({
            where: {
                idUsuario: id
            }
        })

        if (!userFound) {
            return new HttpException('Usuario no encontrado existe', HttpStatus.CONFLICT)
        }
        // console.log('datos');

        // console.log('files', file.mimetype);

        const path = `firmas/${id}/observacion/` + this._up.returnNameDateType(file['mimetype']);
        const imgBucket = await this._up.upPublicFile(file.buffer, path);

        pefil.url = imgBucket.Location;
        pefil.nombreArchivo = imgBucket.Key;
        pefil.tipoArchivo = file.mimetype;
        pefil.path = path;

        const newUser = this.userPerfil.create(pefil)
        const d = await this.userPerfil.save(newUser)
        const info = await this.userRepositorio.update({
            idUsuario: id,
        }, {
            perfil: newUser
        });

        return info


        // const newImgObs = await this.observacionImgRepositorio.create(imgObs);
        // const saveImgObs = await this.observacionImgRepositorio.save(newImgObs);
        // newImgObs.observacion = observacion;
        // newImgObs.user = userFound;
        // this.observacionImgRepositorio.save(saveImgObs);
        return new HttpException('Informacion cargad', HttpStatus.ACCEPTED);


        // const newUser = this.userPerfil.create(pefil)
        // userFound.perfil = newUser;
        // return this.userPerfil.save(newUser)
    }

    async correccion(mensaje: any) {
        const dat =  await this._openai.correccionGramatical(mensaje)
        return dat
    }
}
