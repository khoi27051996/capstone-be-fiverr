import { Body, Controller, Post, Req, UseGuards, Get, Put, Param, Delete } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) { }

  @Get('/get-list')
  getList() {
    return this.binhLuanService.getList()
  }

  @Post('/create')
  createBl(@Body() body, @Req() req) {
    let tokenDecode = req.user;
    let { id } = tokenDecode.data
    return this.binhLuanService.createBl(body, id)
  };

  @Put('/edits-noi-dung/:id')
  editsNoiDung(@Param("id") id: string, @Body() body) {
    return this.binhLuanService.editsNoiDung(Number(id), body)
  };

  @Delete('/delete/:idBinhLuan')
  deleteBinh(@Param("idBinhLuan") idBinhLuan: string, @Req() req) {
    let tokenDecode = req.user;
    let { id } = tokenDecode.data;
    return this.binhLuanService.deleteBl(Number(idBinhLuan), id)
  };

  @Get('/get-by-cong-viec/:idCongViec')
  getByCongViec(@Param("idCongViec") idCongViec: string) {
    return this.binhLuanService.getByCongViec(Number(idCongViec))
  };


}
