import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { NguoiDungModule } from './nguoi-dung/nguoi-dung.module';
import { LoaiCongViecModule } from './loai-cong-viec/loai-cong-viec.module';
import { ChiTietLoaiCongViecModule } from './chi-tiet-loai-cong-viec/chi-tiet-loai-cong-viec.module';
import { NhomChiTietLoaiModule } from './nhom-chi-tiet-loai/nhom-chi-tiet-loai.module';
import { CongViecModule } from './cong-viec/cong-viec.module';
import { ThueCongViecModule } from './thue-cong-viec/thue-cong-viec.module';
import { BinhLuanModule } from './binh-luan/binh-luan.module';
@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), NguoiDungModule, LoaiCongViecModule, ChiTietLoaiCongViecModule, NhomChiTietLoaiModule, CongViecModule, ThueCongViecModule, BinhLuanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
