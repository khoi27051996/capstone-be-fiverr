import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Query } from '@nestjs/common';
import { ThueCongViecService } from './thue-cong-viec.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThueCongViec } from './entities/thueCv.entities';
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiTags('Thuê-công-việc')
@Controller('api/thue-cong-viec')
export class ThueCongViecController {
  constructor(private readonly thueCongViecService: ThueCongViecService) { }

  @Get('/get-list')
  getList() {
    return this.thueCongViecService.getList()
  };

  @Get('/get-pagination')
  getPagination(@Query("Page Size") pageSize: string, @Query("Page Index") pageIndex: number) {
    return this.thueCongViecService.getPagination(Number(pageSize), pageIndex)
  };

  @Get('/get-by-id/:idThue')
  getById(@Param("idThue") idThue: string) {
    return this.thueCongViecService.getById(Number(idThue))
  }

  @Put('/edits/:idThue')
  editsById(@Param("idThue") idThue: string) {
    return this.thueCongViecService.editsById(Number(idThue))
  };

  @Post('/create')
  createThueCongViec(@Body() body: ThueCongViec, @Req() req) {
    let tokenDecode = req.user
    let { id } = tokenDecode.data
    return this.thueCongViecService.createThueCongViec(body, id)
  };

  @Delete('/delete/:idThue')
  deleteById(@Param("idThue") idThue: string) {
    return this.thueCongViecService.deleteById(Number(idThue))
  };

  @Get('/get-by-user/:idUser')
  getByUser(@Param("idUser") idUser: string) {
    return this.thueCongViecService.getByUser(Number(idUser))
  };


}
