import { Product } from "src/models/product.model";
import { PackingOrderRequest } from "./packing-order.dto";
import { OrderDto } from "../entity/order.dto";
import { ProductDto } from "../entity/product.dot";

export class OrderBag {

    orders : {
        id: string;
        products: Product[];
    }[] = [];

    static make(packingOrder: PackingOrderRequest): OrderBag
    {
        const packingBag = new OrderBag();

        packingBag.orders = packingOrder.pedidos.map((order: OrderDto) => ({
            id : order.pedido_id,
            products : order.produtos.map((product: ProductDto) => Product.make({
                id: product.produto_id,
                length: product.dimensoes.comprimento,
                width: product.dimensoes.largura,
                height: product.dimensoes.altura,
            }))
        }));

        return packingBag;
    }
}
