import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { error } from 'console';
import { CTLCV } from './entities/CTLCV.entities';


@Injectable()
export class ChiTietLoaiCongViecService {
    prisma = new PrismaClient()

    async getList() {
        let data = await this.prisma.chi_tiet_loai_cong_viec.findMany()
        let dataTrue = data.filter(v => v.trang_thai == true)
        return dataTrue
    };
    async getById(id: number) {
        let data = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
            where: {
                id
            }
        })
        return data
    };
    async createCTLCV(body: CTLCV) {
        let { ten_chi_tiet, ma_nhom_chi_tiet } = body
        let data = await this.prisma.nhom_chi_tiet_loai.findFirst({
            where: {
                id: ma_nhom_chi_tiet
            }
        });
        if (data) {
            let checkTen = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
                where: {
                    ten_chi_tiet
                }
            });
            if (checkTen) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Tên chi tiết đã tồn tại !!!"
                }, HttpStatus.BAD_REQUEST, { cause: error })
            } else {
                let newData = {
                    ten_chi_tiet,
                    ma_nhom_chi_tiet,
                    trang_thai: true
                }
                await this.prisma.chi_tiet_loai_cong_viec.create({ data: newData })
                return "Tạo thành công !!!"
            }
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã nhóm chi tiết không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async deleteById(id) {
        await this.prisma.chi_tiet_loai_cong_viec.update({
            where: {
                id
            },
            data: {
                trang_thai: false
            }
        });
        return "Xóa thành công !!!"
    };

    async editsById(id: number, ten_chi_tiet: string) {

        let checkTen = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
            where: {
                ten_chi_tiet
            }
        });
        if (checkTen) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Tên chi tiết đã tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        } else {
            await this.prisma.chi_tiet_loai_cong_viec.update({
                where: {
                    id
                },
                data: {
                    ten_chi_tiet
                }
            });
            return "Cập nhật thành công !!!"
        }
    };

    async getPagination(pageIndex: number, pageSize: number, nameSearch: string) {

        let skip = (pageIndex - 1) * pageSize;
        let take = pageSize;

        let data = await this.prisma.chi_tiet_loai_cong_viec.findMany({
            skip,
            take,
            where: {
                ten_chi_tiet: {
                    contains: nameSearch
                }
            }
        });
        return data
    }
}
