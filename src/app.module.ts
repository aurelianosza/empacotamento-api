import { Module } from '@nestjs/common';
import { BoxDimensionsInterface } from './services/interfaces/box-dimensions.interface';
import { BoxDimensionsService } from './services/box-dimensions.service';
import { PackingController } from './controllers/packing.controller';

@Module({
  imports: [],
  controllers: [
    PackingController
  ],
  providers: [
    {
      provide: BoxDimensionsInterface,
      useClass: BoxDimensionsService
    }
  ],
})
export class AppModule {}
