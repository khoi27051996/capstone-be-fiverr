import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/nguoi-dung/entities/nguoi-dung.entities';
import { SignIn, SignUp } from './entities/authEntities';
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }
    prisma = new PrismaClient()

    async signUp(body: SignUp) {
        let { name, email, pass_word, phone, birth_day, gender } = body

        let checkEmail = await this.prisma.nguoi_dung.findFirst({
            where: {
                email
            }
        })
        if (checkEmail) {
            return "Email đã tồn tại !!!"
        } else {
            let passBcrypt = bcrypt.hashSync(pass_word, 10)
            let data = { name, email, pass_word: passBcrypt, phone, birth_day, gender, role: "USER", trang_thai: true }
            await this.prisma.nguoi_dung.create({ data: data })
            return data
        }
    }

    async signIn(body: SignIn) {
        let { email, pass_word } = body
        let checkEmail = await this.prisma.nguoi_dung.findFirst({
            where: {
                email
            }
        });
        if (checkEmail) {
            let checkPass = bcrypt.compareSync(pass_word, checkEmail.pass_word)
            if (checkPass) {
                let token = this.jwtService.sign({ data: checkEmail }, { expiresIn: "60m", secret: "LOGINTOKEN" })
                return token
            } else {
                return "Sai mật khẩu"
            }
        } else {
            return "Sai Email"
        }
    }
}
