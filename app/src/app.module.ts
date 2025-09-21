import { Module } from '@nestjs/common';
import { BoxDimensionsInterface } from './services/interfaces/box-dimensions.interface';
import { BoxDimensionsService } from './services/box-dimensions.service';
import { PackingController } from './controllers/packing.controller';
import { AllocateBoxesOperation } from './operations/allocate-boxes.opertion';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [
    PackingController
  ],
  providers: [
    {
      provide: BoxDimensionsInterface,
      useClass: BoxDimensionsService
    },
    AllocateBoxesOperation
  ],
})
export class AppModule {}
