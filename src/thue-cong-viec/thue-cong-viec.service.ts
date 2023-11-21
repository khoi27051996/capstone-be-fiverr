import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import { ThueCongViec } from './entities/thueCv.entities';
@Injectable()
export class ThueCongViecService {
    prisma = new PrismaClient();

    async getList() {
        let data = await this.prisma.thue_cong_viec.findMany()
        let dataTrue = data.filter(v => v.trang_thai == true)
        return dataTrue
    };


    async getPagination(pageSize: number, pageIndex: number) {

        let skip = (pageIndex - 1) * pageSize;
        let take = pageSize;

        let data = await this.prisma.thue_cong_viec.findMany({
            skip,
            take
        });
        return data
    };

    async getById(id: number) {
        let data = await this.prisma.thue_cong_viec.findFirst({
            where: {
                id
            }
        });
        return data
    }

    async createThueCongViec(body: ThueCongViec, id) {
        let { ma_cong_viec } = body;

        let data = await this.prisma.thue_cong_viec.findMany({
            where: {
                ma_nguoi_thue: id
            }
        });

        let checkData = await this.prisma.cong_viec.findFirst({
            where: {
                id: ma_cong_viec
            }
        })
        if (checkData) {
            if (data) {
                let checkCv = data.find(v => v.ma_cong_viec == ma_cong_viec)
                if (checkCv) {
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: "Bạn đã thuê công việc này rồi !!!"
                    }, HttpStatus.BAD_REQUEST, { cause: error })
                } else {
                    let newData = {
                        ma_cong_viec,
                        ma_nguoi_thue: id,
                        ngay_thue: new Date(),
                        hoan_thanh: false,
                        trang_thai: true
                    }
                    await this.prisma.thue_cong_viec.create({ data: newData })
                    return "Thuê công việc thành công !!!"

                }
            } else {
                let newData = {
                    ma_cong_viec,
                    ma_nguoi_thue: id,
                    ngay_thue: new Date(),
                    hoan_thanh: false
                }
                await this.prisma.thue_cong_viec.create({ data: newData })
                return "Thuê công việc thành công !!!"
            }
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã loại công việc không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }

    };

    async editsById(id: number) {

        await this.prisma.thue_cong_viec.update({
            where: {
                id
            },
            data: {
                hoan_thanh: true
            }
        })
        return "Chỉnh sửa thành công !!!"
    };

    async deleteById(id: number) {
        await this.prisma.thue_cong_viec.update({
            where: {
                id
            },
            data: {
                trang_thai: false
            }
        });
        return "Xóa thành công !!!"
    };

    async getByUser(id: number) {
        let data = await this.prisma.thue_cong_viec.findMany({
            where: {
                ma_nguoi_thue: id
            },
            include: {
                cong_viec: true
            }
        });
        if (data.length > 0) {
            return data
        } else {
            return "Bạn chưa thuê công việc !!!"
        }
    };

}
