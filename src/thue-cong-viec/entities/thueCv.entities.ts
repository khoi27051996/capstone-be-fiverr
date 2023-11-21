import { ApiProperty } from "@nestjs/swagger"

export class ThueCongViec {
    id: number
    @ApiProperty()
    ma_cong_viec: number

    ma_nguoi_thue: number
    ngay_thue: Date
    hoan_thanh: boolean
    trang_thai: boolean
}