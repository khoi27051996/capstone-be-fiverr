import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { error } from 'console';
import { LoaiCongViec } from './entities/loaiCongViec.entities';
@Injectable()
export class LoaiCongViecService {
    prisma = new PrismaClient()

    async createLoaiCv(body: LoaiCongViec) {
        let { ten_loai_cong_viec } = body
        let data = await this.prisma.loai_cong_viec.findFirst({
            where: {
                ten_loai_cong_viec
            }
        });
        if (data) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Tên công việc đã tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        } else {

            let newData = { ten_loai_cong_viec, trang_thai: true };

            return await this.prisma.loai_cong_viec.create({ data: newData })
        }
    };

    async editLoaiCv(id: number, body: LoaiCongViec) {
        let { ten_loai_cong_viec } = body;
        let data = await this.prisma.loai_cong_viec.findFirst({
            where: {
                ten_loai_cong_viec
            }
        });
        if (data) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Tên loại công việc đã tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        } else {
            await this.prisma.loai_cong_viec.update({
                where: {
                    id
                },
                data: {
                    ten_loai_cong_viec
                }
            });
            return "Cập nhật thành công !!!"
        }
    };

    async deleteLoaiCv(id: number) {
        await this.prisma.loai_cong_viec.update({
            where: {
                id
            },
            data: {
                trang_thai: false
            }
        });
        return "Xóa thành công !!!"
    };

    async getListLoaiCv() {
        let data = await this.prisma.loai_cong_viec.findMany();
        let dataTrue = data.filter(v => v.trang_thai == true)
        return dataTrue
    };

    async getLoaiCvById(id: number) {
        let data = await this.prisma.loai_cong_viec.findFirst({
            where: {
                id
            }
        });
        if (data.trang_thai == true) {
            return data
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã loại công việc không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async getPaginationByName(pageIndex: number, pageSize: number, nameSearch: string) {
        let skip = (pageIndex - 1) * pageSize;
        let take = pageSize;

        let data = await this.prisma.loai_cong_viec.findMany({
            skip,
            take,
            where: {
                ten_loai_cong_viec: {
                    contains: nameSearch
                }
            }
        });
        return data
    }
}
