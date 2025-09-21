import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class Dimensions {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    comprimento: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    largura: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    altura: number
}
