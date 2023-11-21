import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import { BinhLuan } from './entities/binhLuan.entities';
@Injectable()
export class BinhLuanService {
    prisma = new PrismaClient();

    async getList() {
        let data = await this.prisma.binh_luan.findMany()
        let dataTrue = data.filter(v => v.trang_thai == true)
        return dataTrue
    };

    async createBl(body: BinhLuan, id) {
        let { ma_cong_viec, noi_dung } = body;
        let data = {
            ma_cong_viec,
            noi_dung,
            ma_nguoi_binh_luan: id,
            ngay_binh_luan: new Date(),
            sao_binh_luan: 0,
            trang_thai: true
        };
        return await this.prisma.binh_luan.create({ data: data })
    };

    async editsNoiDung(id: number, body: BinhLuan) {
        let { noi_dung } = body;
        return await this.prisma.binh_luan.update({
            where: {
                id
            },
            data: {
                noi_dung
            }
        })
    };

    async deleteBl(idBl: number, id) {
        let data = await this.prisma.binh_luan.findFirst({
            where: {
                id: idBl
            },
            include: {
                nguoi_dung: true
            }
        });
        if (id == data.nguoi_dung.id) {
            await this.prisma.binh_luan.update({
                where: {
                    id: idBl
                },
                data: {
                    trang_thai: false
                }
            })
            return "Xóa thành công !!!"
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Bạn không có quyền xóa !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async getByCongViec(id: number) {
        let data = await this.prisma.cong_viec.findMany({
            where: {
                id
            },
            include: {
                binh_luan: true
            }
        })
        return data
    }
}
