import { Controller, Post, Body, UseGuards, Req, HttpException, HttpStatus, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { LoaiCongViecService } from './loai-cong-viec.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoaiCongViec } from './entities/loaiCongViec.entities';

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiTags('Loại-công-việc')
@Controller('api/loai-cong-viec')
export class LoaiCongViecController {
  constructor(private readonly loaiCongViecService: LoaiCongViecService) { }

  @Post('/create')
  createLoaiCv(@Body() body: LoaiCongViec, @Req() req) {
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
  editLoaiCv(@Param("id") id: string, @Body() body: LoaiCongViec, @Req() req) {
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
  getPaginationByName(@Query("PageIndex") pageIndex: number, @Query("PageSize") pageSize: string, @Query("NameSearch") nameSearch: string, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.loaiCongViecService.getPaginationByName(pageIndex, Number(pageSize), nameSearch)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  }
}
