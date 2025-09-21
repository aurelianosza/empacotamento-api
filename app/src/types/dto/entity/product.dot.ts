import { Type } from "class-transformer";
import { IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";
import { Dimensions } from "./dimensions.dto";

export class ProductDto {
    @IsNotEmpty()
    @IsString()
    produto_id: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Dimensions)
    dimensoes: Dimensions
}
