import { ApiProperty } from '@nestjs/swagger'
export class LoaiCongViec {
    @ApiProperty()
    ten_loai_cong_viec: string
    @ApiProperty()
    trang_thai: boolean
}