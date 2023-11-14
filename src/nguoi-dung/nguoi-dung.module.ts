import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { JwtStrategy } from 'src/Strategi/jwt.strategi';

@Module({
  controllers: [NguoiDungController],
  providers: [NguoiDungService, JwtStrategy],
})
export class NguoiDungModule {}
