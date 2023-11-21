import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { error } from 'console';
import * as bcrypt from 'bcrypt'

import { PaginationName, SearchName, SignIn, SignUp, UpdateUser } from 'src/auth/entities/authEntities';
import { LinkImg, deleteUser } from './entities/nguoi-dung.entities';
@Injectable()
export class NguoiDungService {
    prisma = new PrismaClient()

    // Api thuộc role Admin

    async getListUser() {
        let data = await this.prisma.nguoi_dung.findMany()
        let newData = data.filter((v) => v.trang_thai == true)
        return newData
    };
    async createUser(body: SignUp) {
        let { email, pass_word, name, role } = body
        let checkEmail = await this.prisma.nguoi_dung.findFirst({
            where: {
                email
            }
        })
        if (checkEmail) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Email đã tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, {
                cause: error
            })
        } else {
            let passBrypt = bcrypt.hashSync(pass_word, 10)
            let data = {
                name, email, pass_word: passBrypt, role, trang_thai: true
            }
            await this.prisma.nguoi_dung.create({ data: data })
            return "Tạo thành công !!!"
        }
    };
    async deleteUser(body: deleteUser) {
        let { id } = body
        await this.prisma.nguoi_dung.update({
            where: {
                id
            },
            data: {
                trang_thai: false
            }
        })
        return "Xóa thành công !!!"
    };
    async getPagination(pageIndex: number, pageSize: number, nameSearch: string) {
        let skip = (pageIndex - 1) * pageSize;
        let take = pageSize;
        const data = await this.prisma.nguoi_dung.findMany({
            skip: skip,
            take: take,
            where: {
                name: {
                    contains: nameSearch
                }
            }
        });

        return data
    };
    async searchName(nameSearch) {
        // let { nameSearch } = body
        let data = await this.prisma.nguoi_dung.findMany({
            where: {
                name: {
                    contains: nameSearch
                }
            }
        })
        return data
    };


    //Api user

    async getUserById(id: number) {
        let data = await this.prisma.nguoi_dung.findFirst({
            where: {
                id
            }
        })
        if (data) {
            if (data.trang_thai == true) {
                return data;
            } else {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Tài khoản không tồn tại"
                }, HttpStatus.BAD_REQUEST, { cause: error })
            }
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Thông tin không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async updateUser(body: UpdateUser, id: number) {

        let { name, phone, birth_day, gender, skil, certification } = body;

        await this.prisma.nguoi_dung.update({
            where: {
                id
            },
            data: { name, phone, birth_day, gender, skil, certification }
        })
        return "Cập nhật thành công !!!"
    };

    async updatePass(pass_word_old: string, pass_word_new: string, id: number) {

        let data = await this.prisma.nguoi_dung.findFirst({
            where: {
                id
            }
        })
        let checkPass = bcrypt.compareSync(pass_word_old, data.pass_word)
        if (checkPass) {
            let passBrypt = bcrypt.hashSync(pass_word_new, 10)
            await this.prisma.nguoi_dung.update({
                where: {
                    id
                },
                data: {
                    pass_word: passBrypt
                }
            })
            return "Đổi mật khẩu thành công !!!"
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mật khẩu cũ không đúng !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async uploadAvatar(file, id) {
        await this.prisma.nguoi_dung.update({
            where: {
                id
            },
            data: {
                avatar: file.filename
            }
        })
        return "Upload Avatar thành công !!!"
    };

    async uploadAvtByLink(body: LinkImg, id) {
        let { linkImg } = body
        await this.prisma.nguoi_dung.update({
            where: {
                id
            },
            data: {
                avatar: linkImg
            }
        })
        return "Upload thành công !!!"
    }
}
