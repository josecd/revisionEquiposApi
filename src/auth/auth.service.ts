import { Injectable,UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entitiys/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepositorio: Repository<User>,
    private jwtService: JwtService
    ){

  }


  async signIn(correo: string, pass: string): Promise<any> {
    
    const user = await this.userRepositorio.findOne({
        where: {
            correo: correo,
            clave:pass
        },
        relations:['perfil']

    })
    if (user?.clave !== pass) {
        throw new UnauthorizedException();
    }
    
    const { clave, ...result } = user;

    const payload = { sub: user.idUsuario, username: user.correo };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user :{
        idUsuario:user.idUsuario,
        nombre:user.nombre,
        correo:user.correo,
        perfil:user.perfil,
      }
    };

    return result;
}

}
