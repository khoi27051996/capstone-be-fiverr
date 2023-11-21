import { ApiProperty } from "@nestjs/swagger";

export class NhomChiTietLoai {
    @ApiProperty()
    id: number
    @ApiProperty()
    ten_nhom: string
    @ApiProperty()
    ma_loai_cong_viec: number
    @ApiProperty()
    hinh_anh: string
}