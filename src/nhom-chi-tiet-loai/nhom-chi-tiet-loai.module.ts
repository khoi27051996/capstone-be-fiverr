import { Module } from '@nestjs/common';
import { NhomChiTietLoaiService } from './nhom-chi-tiet-loai.service';
import { NhomChiTietLoaiController } from './nhom-chi-tiet-loai.controller';

@Module({
  controllers: [NhomChiTietLoaiController],
  providers: [NhomChiTietLoaiService],
})
export class NhomChiTietLoaiModule {}
