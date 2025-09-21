import { Injectable } from "@nestjs/common";
import { StackBoxOverflow } from "src/exceptions/stack-box-overflow";
import { Box } from "src/models/box.model";
import { Product } from "src/models/product.model";
import { BoxDimensionsInterface } from "src/services/interfaces/box-dimensions.interface";
import { GroupLengths } from "src/types/product-group.type";

@Injectable()
export class AllocateBoxesOperation {

    constructor(
        private boxDimensionService: BoxDimensionsInterface,
    )
    {}

    async execute(products: Product[]) {
        const boxes: Box[] = [];
        let productsWithoutBoxes: Product[] = [];

        const groupedProducts = this.boxDimensionService
            .organizeGroups(products);

        let currentBox: Box|null|undefined = null;
        let selectedProduct: Product|null|undefined = undefined;
        for (const group  of Object.keys(this.boxDimensionService.getAvailableGroupDimensions()) as GroupLengths[]) {
            if (group.toString() == "colossus") {
                continue;
            }

            const reamingProductGroup = groupedProducts[group]
                ?.sort((productA, productB) => productB.height - productA.height)
                ?? [];

            while (
                reamingProductGroup.length > 0 ||
                selectedProduct
            ) {
                selectedProduct = selectedProduct ?? reamingProductGroup.shift();

                if (!currentBox) {
                    currentBox = Box.getBoxForGroup(group);
                }

                try {
                    currentBox.addProduct(selectedProduct!);
                    selectedProduct = null;
                } catch (exception) {
                    if (exception instanceof StackBoxOverflow) {
                        boxes.push(currentBox);
                        currentBox = null;
                        continue;
                    }
                    throw exception;
                }
            }
        }

        if (currentBox) {
            boxes.push(currentBox);
        }

        productsWithoutBoxes = groupedProducts['colossus'];

        return {
            boxes,
            productsWithoutBoxes
        };
    }

}
