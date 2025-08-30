import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { log } from 'console';


@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  
  async register(registerDto: RegisterDto) {
    const hashed = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({ ...registerDto, password: hashed });
    return { id: user.id, name: user.name, email: user.email };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException('Email inválido');

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Senha inválida');

    const payload = { sub: user.id, email: user.email, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }

}
