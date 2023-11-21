import { ApiProperty } from '@nestjs/swagger'
export class User {
    id: number
    name: string
    email: string
    pass_word: string
    phone: string
    birth_day: string
    gender: string
    role: "USER" | "ADMIN"
    skil: string
    certification: string
    trang_thai: boolean
}

export class deleteUser {
    @ApiProperty()
    id: number
}

export class FileUploadImg {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any
}

export class LinkImg {
    @ApiProperty()
    linkImg: string
}