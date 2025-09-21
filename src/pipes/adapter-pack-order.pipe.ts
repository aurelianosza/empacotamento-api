import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { OrderBag } from 'src/types/dto/requests/order-bag.dto';
import { PackingOrderRequest } from 'src/types/dto/requests/packing-order.dto';

@Injectable()
export class AdapterPackOrderPipe implements PipeTransform<PackingOrderRequest, OrderBag> {
    transform(value: PackingOrderRequest, metadata: ArgumentMetadata)
    {
        return OrderBag.make(value);   
    }
}
