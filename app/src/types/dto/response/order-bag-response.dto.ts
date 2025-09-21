import { Box } from "src/models/box.model";
import { Product } from "src/models/product.model"

type BoxResponse = {
    caixa_id: string|null,
    produtos: string[],
    observacao?: string
}

type OrderResponse = {
    pedido_id: number;
    caixas: BoxResponse[]
}

export class OrderBagResponse {

    constructor(private orders: {
        id: number,
        boxes: Box[],
        productsWithoutBoxes: Product[]
    }[])
    {}

    respond(): OrderResponse[]
    {
        return this.orders
            .map((order) => {
                const boxes = this.formatBoxArray(order.boxes);
                
                if (order.productsWithoutBoxes?.length > 0) {
                    boxes.push({
                        caixa_id: null,
                        produtos: order.productsWithoutBoxes
                            .map(product => product.id),
                        observacao: this.getProductColossusWarning()
                    })
                }

                return {
                    pedido_id: order.id,
                    caixas: boxes
                }
            });
    }

    private formatBoxArray(boxes: Box[]): BoxResponse[]  {
        return boxes.map((box: Box, index: number) => ({
            caixa_id: this.getBoxIdWithPrefixName(index),
            produtos: box.getProducts()
                .map((product: Product) => product.id)
        }));
    }

    private getBoxIdWithPrefixName(id: number): string {
        return "Caixa :box_id".replace(":box_id", (id + 1).toString());
    }

    private getProductColossusWarning(): string
    {
        return "Produto não cabe em nenhuma caixa disponível.";
    }
}
