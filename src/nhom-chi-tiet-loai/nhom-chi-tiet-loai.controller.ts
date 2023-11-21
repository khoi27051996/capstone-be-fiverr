import { Controller, UseGuards, Post, Body, Req, HttpException, HttpStatus, Get, Put, Param, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { NhomChiTietLoaiService } from './nhom-chi-tiet-loai.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NhomChiTietLoai } from './entities/nhomCTL.entities';
import { FileUploadImg } from 'src/nguoi-dung/entities/nguoi-dung.entities';

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiTags("Nhóm-chi-tiết-loại")
@Controller('api/nhom-chi-tiet-loai')
export class NhomChiTietLoaiController {
  constructor(private readonly nhomChiTietLoaiService: NhomChiTietLoaiService) { }

  @Get('/get-list')
  getList() {
    return this.nhomChiTietLoaiService.getList()
  }
  @Get('/get-by-id/:id')
  getById(@Param("id") id: string) {
    return this.nhomChiTietLoaiService.getById(Number(id))
  }
  @Post('/create')

  createNhom(@Body() body: NhomChiTietLoai, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data
    if (role == 'ADMIN') {
      return this.nhomChiTietLoaiService.createNhom(body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  };

  @Put('/edits/:id')
  editsNhom(@Query("Tên Nhóm") ten_nhom: string, @Query("Hình Ảnh") hinh_anh: string, @Req() req, @Param("id") id: string) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data
    if (role == 'ADMIN') {
      return this.nhomChiTietLoaiService.editsNhom(ten_nhom, hinh_anh, Number(id))
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, { cause: error })
    }
  };

  // Upload ảnh cho nhóm theo file
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
  @Post('/upload-img/:id')
  uploadImg(@UploadedFile() file: Express.Multer.File, @Param("id") id: string) {
    return this.nhomChiTietLoaiService.uploadImg(file, Number(id))
  }


}
