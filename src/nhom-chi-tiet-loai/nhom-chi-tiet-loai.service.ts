import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, nhom_chi_tiet_loai } from '@prisma/client'
import { error } from 'console';
import { NhomChiTietLoai } from './entities/nhomCTL.entities';
@Injectable()
export class NhomChiTietLoaiService {
    prisma = new PrismaClient();

    async getList() {
        let data = await this.prisma.nhom_chi_tiet_loai.findMany({
            include: {
                chi_tiet_loai_cong_viec: true
            }
        })
        return data
    };
    async getById(id: number) {
        let data = await this.prisma.nhom_chi_tiet_loai.findFirst({
            where: {
                id
            },
            include: {
                chi_tiet_loai_cong_viec: true
            }
        })
        return data
    };
    async createNhom(body: NhomChiTietLoai) {
        let { ma_loai_cong_viec, ten_nhom, hinh_anh } = body;
        let data = await this.prisma.loai_cong_viec.findFirst({
            where: {
                id: ma_loai_cong_viec
            }
        });
        if (data) {
            let checkTenNhom = await this.prisma.nhom_chi_tiet_loai.findFirst({
                where: {
                    ten_nhom
                }
            })
            if (checkTenNhom) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Tên nhóm đã tồn tại !!!"
                }, HttpStatus.BAD_REQUEST, { cause: error })
            } else {
                let newData = {
                    ten_nhom,
                    hinh_anh,
                    ma_loai_cong_viec
                };
                await this.prisma.nhom_chi_tiet_loai.create({ data: newData })
                return "Tạo thành công !!!"
            }
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã Loại công việc không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async editsNhom(ten_nhom, hinh_anh, id: number) {
        let checkTen = await this.prisma.nhom_chi_tiet_loai.findFirst({
            where: {
                ten_nhom
            }
        });
        if (checkTen) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Tên nhóm đã tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        } else {
            await this.prisma.nhom_chi_tiet_loai.update({
                where: {
                    id
                },
                data: {
                    ten_nhom,
                    hinh_anh
                }
            })
            return "Chỉnh sửa thành công !!!"
        }
    };

    async uploadImg(file, id: number) {
        await this.prisma.nhom_chi_tiet_loai.update({
            where: {
                id
            },
            data: {
                hinh_anh: file.filename
            }
        })
        return "Upload thành công !!!"
    }
}
