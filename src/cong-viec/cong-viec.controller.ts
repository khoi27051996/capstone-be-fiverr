import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { CongViecService } from './cong-viec.service';
import { error } from 'console';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CongViec } from './entities/congViec.entities';
import { FileUploadImg } from 'src/nguoi-dung/entities/nguoi-dung.entities';
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiTags('Công-việc')
@Controller('api/cong-viec')
export class CongViecController {
  constructor(private readonly congViecService: CongViecService) { }
  @Get('/get')
  getListCv() {
    return this.congViecService.getListCv()
  };

  @Get('/get-pagination')
  getPagination(@Query("Page Size") pageSize: string, @Query("Page Index") pageIndex: number, @Query("Name Search") nameSearch: string) {
    return this.congViecService.getPagination(pageIndex, Number(pageSize), nameSearch)
  }

  @Get('/get-by-namesearch')
  getByNameSearch(@Query("Name Search") nameSearch: string) {
    return this.congViecService.getByNameSearch(nameSearch)
  }
  @Get('/get-by-id/:id')
  getById(@Param("id") id: string) {
    return this.congViecService.getById(Number(id))
  }
  @Post('/create')
  createCongViec(@Body() body: CongViec, @Req() req) {
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
  editById(@Param("id") id: string, @Body() body: CongViec, @Req() req) {
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadImg
  })
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
