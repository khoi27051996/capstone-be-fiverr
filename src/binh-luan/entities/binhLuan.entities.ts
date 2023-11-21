import { ApiProperty } from "@nestjs/swagger"

export class BinhLuan {
    id: number
    @ApiProperty()
    ma_cong_viec: number

    ma_nguoi_binh_luan: number

    ngay_binh_luan: Date

    @ApiProperty()
    noi_dung: string

    sao_binh_luan: number
    trang_thai: boolean
}