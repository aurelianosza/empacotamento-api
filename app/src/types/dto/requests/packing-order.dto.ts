import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { OrderDto } from "../entity/order.dto";
import { Type } from "class-transformer";

export class PackingOrderRequest {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true
    })
    @Type(() => OrderDto)
    pedidos: OrderDto[]
}
