import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, Query } from '@nestjs/common';
import { ChiTietLoaiCongViecService } from './chi-tiet-loai-cong-viec.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CTLCV } from './entities/CTLCV.entities';

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiTags('Chi-tiết-loại-công-việc')
@Controller('api/chi-tiet-loai-cong-viec')
export class ChiTietLoaiCongViecController {
  constructor(private readonly chiTietLoaiCongViecService: ChiTietLoaiCongViecService) { }

  @Get('/get')
  getList() {
    return this.chiTietLoaiCongViecService.getList()
  }
  @Get('/get-by-id/:id')
  getById(@Param("id") id: string) {
    return this.chiTietLoaiCongViecService.getById(Number(id))
  }
  @Post('/create')
  createCTLCV(@Body() body: CTLCV, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.chiTietLoaiCongViecService.createCTLCV(body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  }

  @Delete('/delete/:id')
  deleteById(@Param("id") id: string, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.chiTietLoaiCongViecService.deleteById(Number(id))
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  }

  @Put('/edits/:id')
  editsById(@Param("id") id: string, @Req() req, @Query("Tên chi tiết") ten_chi_tiet: string) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.chiTietLoaiCongViecService.editsById(Number(id), ten_chi_tiet)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  };

  @Get('/get-pagination')
  getPagination(@Query("PageIndex") pageIndex: number, @Query("PageSize") pageSize: string, @Query("NameSearch") nameSearch: string) {
    return this.chiTietLoaiCongViecService.getPagination(pageIndex, Number(pageSize), nameSearch)
  }
}
