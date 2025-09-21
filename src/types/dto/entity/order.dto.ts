import { Type } from "class-transformer";
import { ArrayMinSize, IsInt, IsNotEmpty, IsNumber, IsString, Min, MIN, MinLength, ValidateNested } from "class-validator";
import { ProductDto } from "./product.dot";

export class OrderDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    pedido_id: string

    @ValidateNested({
        each: true
    })
    @IsNotEmpty()
    @ArrayMinSize(1)
    @Type(() => ProductDto)
    produtos: ProductDto[];
}
