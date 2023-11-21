import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { error } from 'console';
import { CongViec } from './entities/congViec.entities';
@Injectable()
export class CongViecService {
    prisma = new PrismaClient();

    async getListCv() {
        let data = await this.prisma.cong_viec.findMany();

        let dataTrue = data.filter(v => v.trang_thai == true);
        return dataTrue
    };

    async getPagination(pageIndex: number, pageSize: number, nameSearch: string) {
        let skip = (pageIndex - 1) * pageSize;
        let take = pageSize;
        let data = await this.prisma.cong_viec.findMany({
            skip,
            take,
            where: {
                ten_cong_viec: {
                    contains: nameSearch
                }
            }
        });
        return data
    };
    async getByNameSearch(nameSearch: string) {
        let data = await this.prisma.cong_viec.findMany({
            where: {
                ten_cong_viec: {
                    contains: nameSearch
                }
            }
        });
        let dataTrue = data.filter(v => v.trang_thai == true);
        return dataTrue
    };
    async getById(id: number) {
        let data = await this.prisma.cong_viec.findFirst({
            where: {
                id
            }
        });
        return data
    };

    async createCongViec(body: CongViec, id) {
        let { ten_cong_viec, danh_gia, gia_tien, hinh_anh, mo_ta, mo_ta_ngan, sao_cong_viec, ma_chi_tiet_loai } = body;
        let data = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
            where: {
                id: ma_chi_tiet_loai
            }
        });
        if (data) {
            let checkTen = await this.prisma.cong_viec.findFirst({
                where: {
                    ten_cong_viec
                }
            });
            if (checkTen) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Tên công việc đã tồn tại !!!"
                }, HttpStatus.BAD_REQUEST, { cause: error })
            } else {
                let newData = {
                    ten_cong_viec,
                    danh_gia,
                    gia_tien,
                    hinh_anh,
                    mo_ta,
                    mo_ta_ngan,
                    sao_cong_viec,
                    ma_chi_tiet_loai,
                    nguoi_tao: id,
                    trang_thai: true
                };
                await this.prisma.cong_viec.create({
                    data: newData
                });
                return "Tạo thành công !!!"
            }
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã chi tiết loại không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async editsById(id: number, body: CongViec) {
        let { ten_cong_viec, danh_gia, gia_tien, hinh_anh, mo_ta, mo_ta_ngan, sao_cong_viec, ma_chi_tiet_loai } = body;
        let data = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
            where: {
                id: ma_chi_tiet_loai
            }
        });
        if (data) {
            let checkTen = await this.prisma.cong_viec.findFirst({
                where: {
                    ten_cong_viec
                }
            });
            if (checkTen) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: "Tên công việc đã tồn tại !!!"
                }, HttpStatus.BAD_REQUEST, { cause: error })
            } else {
                await this.prisma.cong_viec.update({
                    where: {
                        id
                    },
                    data: {
                        ten_cong_viec,
                        danh_gia,
                        gia_tien,
                        hinh_anh,
                        mo_ta,
                        mo_ta_ngan,
                        sao_cong_viec,
                        ma_chi_tiet_loai
                    }
                });
                return "Update thành công !!!"
            }
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã chi tiết loại không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async deleteById(id: number) {
        let data = await this.prisma.cong_viec.findFirst({
            where: {
                id
            }
        })
        if (data) {
            await this.prisma.cong_viec.update({
                where: {
                    id
                },
                data: {
                    trang_thai: false
                }
            });
            return "Xóa thành công !!!"
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "ID công việc không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };
    async upImgByFile(file, id) {
        let data = await this.prisma.cong_viec.findFirst({
            where: {
                id
            }
        })
        if (data) {
            await this.prisma.cong_viec.update({
                where: {
                    id
                },
                data: {
                    hinh_anh: file.filename
                }
            });
            return "Thêm ảnh thành công !!!"
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "ID công việc không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };


    async getChiTietLoaiCongViec(id: number) {
        let data = await this.prisma.loai_cong_viec.findFirst({
            where: {
                id
            }
        });
        if (data) {
            let dataNew = await this.prisma.loai_cong_viec.findFirst({
                where: {
                    id
                },
                include: {
                    nhom_chi_tiet_loai: {
                        include: {
                            chi_tiet_loai_cong_viec: true
                        }
                    }
                }
            });
            return dataNew
        } else {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: "Mã loại công việc không tồn tại !!!"
            }, HttpStatus.BAD_REQUEST, { cause: error })
        }
    };

    async getCongViecTheoChiTietLoai(id: number) {
        let data = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
            where: {
                id
            },
            include: {
                cong_viec: true
            }
        });
        return data
    };

    async getCongViecChiTiet(id: number) {
        let data = await this.prisma.cong_viec.findFirst({
            where: {
                id
            }
        })

        let data2 = await this.prisma.chi_tiet_loai_cong_viec.findFirst({
            where: {
                id: data.ma_chi_tiet_loai
            }
        })
        let tenChiTiet = data2.ten_chi_tiet

        let data3 = await this.prisma.nhom_chi_tiet_loai.findFirst({
            where: {
                id: data2.ma_nhom_chi_tiet
            }
        });
        let tenNhomChiTiet = data3.ten_nhom
        let data4 = await this.prisma.loai_cong_viec.findFirst({
            where: {
                id: data3.ma_loai_cong_viec
            }
        })
        let tenLoaiCongViec = data4.ten_loai_cong_viec
        return { data, tenChiTiet, tenNhomChiTiet, tenLoaiCongViec }
    }
}
