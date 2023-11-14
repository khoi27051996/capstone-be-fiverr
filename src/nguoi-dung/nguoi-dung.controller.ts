import { Controller, Get, UseGuards, Req, HttpException, HttpStatus, Post, Body, Delete, Param, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { AuthGuard } from '@nestjs/passport'
import { error } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@UseGuards(AuthGuard("jwt"))
@Controller('api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) { }

  // API thuộc role ADMIN
  @Get('/get-list-user')
  getListUser(@Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.nguoiDungService.getListUser()
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: "Không đủ quyền !!!"
      }, HttpStatus.FORBIDDEN, {
        cause: error
      }
      )
    }
  }

  @Post('/create-user')
  createUser(@Body() body, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.nguoiDungService.createUser(body)
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: "Không đủ quyền !!!"
      }, HttpStatus.FORBIDDEN, {
        cause: error
      }
      )
    }
  }

  @Delete('/delete')
  deleteUser(@Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { role } = tokenDecode.data;
    if (role == "ADMIN") {
      return this.nguoiDungService.deleteUser(body)
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: "Không đủ quyền !!!"
      }, HttpStatus.FORBIDDEN, {
        cause: error
      })
    }
  }
  // Tìm kiếm theo tên chưa chia page
  @Get('/search-name')
  searchName(@Body() body, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.nguoiDungService.searchName(body)
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: "Không đủ quyền !!!"
      }, HttpStatus.FORBIDDEN, {
        cause: error
      })
    }
  }
  // Tìm kiếm theo tên đã chia page
  @Get('/phan-trang-tim-kiem')
  getPagination(@Body() body) {
    return this.nguoiDungService.getPagination(body)
  };
  // Api người dùng

  @Get('/get-user/:id')
  getUserById(@Param("id") id: string) {
    return this.nguoiDungService.getUserById(Number(id))
  }

  @Put('/update-user/:id')
  updateUser(@Param("id") id: string, @Body() body) {
    return this.nguoiDungService.updateUser(body, Number(id))
  }

  @Put('/update-pass')
  updatePass(@Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { id } = tokenDecode.data;
    return this.nguoiDungService.updatePass(body, id)
  }

  // Update bằng file ảnh có sẵn trên PC
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname)
    })
  }))
  @Post('/upload-avatar')
  updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    let tokenDecode = req.user
    let { id } = tokenDecode.data
    return this.nguoiDungService.uploadAvatar(file, id)
  }

  // Update bằng link ảnh trực tuyến
  @Post('/upload-avatar-by-link')
  uploadAvtByLink(@Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { id } = tokenDecode.data;
    return this.nguoiDungService.uploadAvtByLink(body, id)
  }
}
