import { Controller, Post, Body, UseGuards, Req, HttpException, HttpStatus, Put, Param, Delete, Get } from '@nestjs/common';
import { LoaiCongViecService } from './loai-cong-viec.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';

@UseGuards(AuthGuard("jwt"))
@Controller('api/loai-cong-viec')
export class LoaiCongViecController {
  constructor(private readonly loaiCongViecService: LoaiCongViecService) { }

  @Post('/create')
  createLoaiCv(@Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data;
    if (role == 'ADMIN') {
      return this.loaiCongViecService.createLoaiCv(body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  }
  @Put('/edit/:id')
  editLoaiCv(@Param("id") id: string, @Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.loaiCongViecService.editLoaiCv(Number(id), body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  };

  @Delete('/delete/:id')
  deleteLoaiCv(@Param("id") id: string, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.loaiCongViecService.deleteLoaiCv(Number(id))
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  };

  @Get('/get-list')
  getListLoaiCv() {
    return this.loaiCongViecService.getListLoaiCv()
  };

  @Get('/get-by-id/:id')
  getLoaiCvById(@Param("id") id: string) {
    return this.loaiCongViecService.getLoaiCvById(Number(id))
  };

  @Get('/get-pagination-by-name')
  getPaginationByName(@Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.loaiCongViecService.getPaginationByName(body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  }
}
