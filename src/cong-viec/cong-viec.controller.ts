import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CongViecService } from './cong-viec.service';
import { error } from 'console';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@UseGuards(AuthGuard("jwt"))
@Controller('api/cong-viec')
export class CongViecController {
  constructor(private readonly congViecService: CongViecService) { }
  @Get('/get')
  getListCv() {
    return this.congViecService.getListCv()
  };

  @Get('/get-pagination')
  getPagination(@Body() body) {
    return this.congViecService.getPagination(body)
  }

  @Get('/get-by-namesearch')
  getByNameSearch(@Body() body) {
    return this.congViecService.getByNameSearch(body)
  }
  @Get('/get-by-id/:id')
  getById(@Param("id") id: string) {
    return this.congViecService.getById(Number(id))
  }
  @Post('/create')
  createCongViec(@Body() body, @Req() req) {
    let tokenDecode = req.user
    let { role, id } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.congViecService.createCongViec(body, id)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền!!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }

  }

  @Put('/edits/:id')
  editById(@Param("id") id: string, @Body() body, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.congViecService.editsById(Number(id), body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền!!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }

  };

  @Delete('/delete/:id')
  deleteById(@Param("id") id: string, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.congViecService.deleteById(Number(id))
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền!!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  };


  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.cwd() + '/public/img',
      filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname)
    })
  }))
  @Post('/upload-file/:id')
  upImgByFile(@UploadedFile() file: Express.Multer.File, @Param("id") id: string) {
    return this.congViecService.upImgByFile(file, Number(id))
  };

  @Get('/get-chi-tiet-loai-cong-viec/:id')
  getChiTietLoaiCongViec(@Param("id") id: string) {
    return this.congViecService.getChiTietLoaiCongViec(Number(id))
  };


  @Get('/get-cong-viec-theo-chi-tiet/:id')
  getCongViecTheoChiTietLoai(@Param("id") id: string) {
    return this.congViecService.getCongViecTheoChiTietLoai(Number(id))
  };

  @Get('/get-cong-viec-chi-tiet/:id')
  getCongViecChiTiet(@Param("id") id: string) {
    return this.congViecService.getCongViecChiTiet(Number(id))
  }
}
