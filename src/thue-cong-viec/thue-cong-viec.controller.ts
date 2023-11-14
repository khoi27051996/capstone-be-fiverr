import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ThueCongViecService } from './thue-cong-viec.service';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard("jwt"))
@Controller('api/thue-cong-viec')
export class ThueCongViecController {
  constructor(private readonly thueCongViecService: ThueCongViecService) { }

  @Get('/get-list')
  getList() {
    return this.thueCongViecService.getList()
  };

  @Get('/get-pagination')
  getPagination(@Body() body) {
    return this.thueCongViecService.getPagination(body)
  };

  @Get('/get-by-id/:idThue')
  getById(@Param("idThue") idThue: string) {
    return this.thueCongViecService.getById(Number(idThue))
  }

  @Put('/edits/:idThue')
  editsById(@Param("idThue") idThue: string, @Body() body) {
    return this.thueCongViecService.editsById(Number(idThue), body)
  };

  @Post('/create')
  createThueCongViec(@Body() body, @Req() req) {
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

  @Post('/update-hoan-thanh/:idThue')
  updateThue(@Param("idThue") idThue: string) {
    return this.thueCongViecService.updateThue(Number(idThue))
  }
}
