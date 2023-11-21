import { ApiProperty } from "@nestjs/swagger";

export class CTLCV {
    @ApiProperty()
    id: number
    @ApiProperty()
    ten_chi_tiet: string
    @ApiProperty()
    ma_nhom_chi_tiet: number
    @ApiProperty()
    trang_thai: boolean
}