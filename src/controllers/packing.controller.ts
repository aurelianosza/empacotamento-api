import { Body, Controller, Post } from "@nestjs/common";
import { Box } from "src/models/box.model";
import { Product } from "src/models/product.model";
import { AdapterPackOrderPipe } from "src/pipes/adapter-pack-order.pipe";
import { OrderBag } from "src/types/dto/requests/order-bag.dto";
import { PackingOrderRequest } from "src/types/dto/requests/packing-order.dto";

@Controller("pack-order")
export class PackingController {

    @Post()
    pack(
        @Body() packageRequest: PackingOrderRequest
    ) {
        //todo: adjust validationPipe
        const productBag = OrderBag.make(packageRequest);

        const adjustedOrders = productBag.orders
            .map((order: {
                id: string,
                products: Product[]
            }) => {

                const boxDetail = Box.allocateBoxes(order.products);

                return {
                    pedido_id : order.id,
                    caixas: boxDetail.usedBoxes
                }

            });

        return adjustedOrders;

    }
}
