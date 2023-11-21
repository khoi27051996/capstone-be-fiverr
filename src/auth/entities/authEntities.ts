import { ApiProperty } from '@nestjs/swagger';

export class SignUp {
    @ApiProperty()
    id: number
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    pass_word: string
    @ApiProperty()
    phone: string
    @ApiProperty()
    birth_day: string
    @ApiProperty()
    gender: string
    @ApiProperty()
    role: string
    @ApiProperty()
    skil: string
    @ApiProperty()
    certification: string
    @ApiProperty()
    trang_thai: boolean
}

export class SignIn {
    @ApiProperty()
    email: string
    @ApiProperty()
    pass_word: string
}

export class SearchName {
    @ApiProperty()
    nameSearch: string
}

export class PaginationName {
    @ApiProperty()
    nameSearch: string
    @ApiProperty()
    pageIndex: number
    @ApiProperty()
    pageSize: number
}

export class UpdateUser {
    @ApiProperty()
    name: string
    @ApiProperty()
    phone: string
    @ApiProperty()
    birth_day: string
    @ApiProperty()
    gender: string
    @ApiProperty()
    skil: string
    @ApiProperty()
    certification: string
}