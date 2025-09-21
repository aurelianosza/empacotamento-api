import { Body, Controller, Post } from "@nestjs/common";
import { Box } from "src/models/box.model";
import { Product } from "src/models/product.model";
import { AllocateBoxesOperation } from "src/operations/allocate-boxes.opertion";
import { AdapterPackOrderPipe } from "src/pipes/adapter-pack-order.pipe";
import { OrderBag } from "src/types/dto/requests/order-bag.dto";
import { PackingOrderRequest } from "src/types/dto/requests/packing-order.dto";
import { OrderBagResponse } from "src/types/dto/response/order-bag-response.dto";

@Controller("pack-order")
export class PackingController {

    constructor(private allocateBoxes: AllocateBoxesOperation)
    {}

    @Post()
    async pack(
        @Body() packageRequest: PackingOrderRequest
    ) {
        //todo: adjust validationPipe
        const productBag = OrderBag.make(packageRequest);

        const adjustedOrders = productBag.orders
            .map(async (order: {
                id: string,
                products: Product[]
            }) => {

                const boxDetail = await this.allocateBoxes.execute(order.products);

                const orderDetails =  {
                    id : Number(order.id),
                    boxes: boxDetail.boxes,
                    productsWithoutBoxes: boxDetail.productsWithoutBoxes
                }

                return orderDetails;
            });

        return new OrderBagResponse(await Promise.all(adjustedOrders))
            .respond();
    }
}
