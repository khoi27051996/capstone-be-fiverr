import { Controller, Get, UseGuards, Req, HttpException, HttpStatus, Post, Body, Delete, Param, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { AuthGuard } from '@nestjs/passport'
import { error } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PaginationName, SearchName, SignIn, SignUp, UpdateUser } from 'src/auth/entities/authEntities';
import { FileUploadImg, LinkImg, deleteUser } from './entities/nguoi-dung.entities';
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiTags('Người-Dùng')
@Controller('api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) { }

  // API thuộc role ADMIN

  @Get('/get-list-user')
  // @ApiBody({
  //   type: SignUp
  // })
  getListUser(@Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.nguoiDungService.getListUser()
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, {
        cause: error
      }
      )
    }
  }

  @Post('/create-user')
  createUser(@Body() body: SignUp, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.nguoiDungService.createUser(body)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, {
        cause: error
      }
      )
    }
  }

  @Delete('/delete')
  deleteUser(@Body() body: deleteUser, @Req() req) {
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
  searchName(@Query("Tên") nameSearch: string, @Req() req) {
    let tokenDecode = req.user
    let { role } = tokenDecode.data
    if (role == "ADMIN") {
      return this.nguoiDungService.searchName(nameSearch)
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Không đủ quyền !!!"
      }, HttpStatus.UNAUTHORIZED, {
        cause: error
      })
    }
  }
  // Tìm kiếm theo tên đã chia page
  @Get('/phan-trang-tim-kiem')
  getPagination(@Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: string, @Query("nameSearch") nameSearch: string) {
    return this.nguoiDungService.getPagination(pageIndex, Number(pageSize), nameSearch)
  };
  // Api người dùng

  @Get('/get-user/:id')
  getUserById(@Param("id") id: string) {
    return this.nguoiDungService.getUserById(Number(id))
  }

  @Put('/update-user/:id')
  updateUser(@Param("id") id: string, @Body() body: UpdateUser) {
    return this.nguoiDungService.updateUser(body, Number(id))
  }

  @Put('/update-pass')
  updatePass(@Query("PassOld") pass_word_old: string, @Query("PassNew") pass_word_new: string, @Req() req) {
    let tokenDecode = req.user;
    let { id } = tokenDecode.data;
    return this.nguoiDungService.updatePass(pass_word_old, pass_word_new, id)
  }

  // Update bằng file ảnh có sẵn trên PC
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname)
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadImg
  })
  @Post('/upload-avatar')
  updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    let tokenDecode = req.user
    let { id } = tokenDecode.data
    return this.nguoiDungService.uploadAvatar(file, id)
  }

  // Update bằng link ảnh trực tuyến
  @Post('/upload-avatar-by-link')
  uploadAvtByLink(@Body() body:LinkImg, @Req() req) {
    let tokenDecode = req.user;
    let { id } = tokenDecode.data;
    return this.nguoiDungService.uploadAvtByLink(body, id)
  }
}
