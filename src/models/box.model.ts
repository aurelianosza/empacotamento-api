import { VolumeItem } from "src/types/volume-item.type";
import { ProductStack } from "./product-stack.model";
import { GroupLengths } from "src/types/product-group.type";
import { BoxDimensionsService } from "src/services/box-dimensions.service";
import { Product } from "./product.model";
import { ProductStackOverflow } from "src/exceptions/product-stack-overflow";
import { StackBoxOverflow } from "src/exceptions/stack-box-overflow";

export class Box implements VolumeItem {
	length: number;
	width: number;
    height: number;

	usedLength: number = 0;

	stacks: ProductStack[];

    static allocateBoxes(products: Product[]) {
        const boxes: Box[] = [];
        let productsWithoutBoxes: Product[] = [];

        // todo: resolve this service injection
        const service = new BoxDimensionsService();

        const groupedProducts = service.organizeGroups(products);

        let currentBox: Box|null|undefined = null;
        let selectedProduct: Product|null|undefined = undefined;
        for (const group  of Object.keys(service.getAvailableGroupDimensions()) as GroupLengths[]) {
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

	static getBoxForGroup (groupName: GroupLengths): Box
	{
        // todo: resolve this service injection
        const service = new BoxDimensionsService();

		const boxDimension = service.getDimensionsForGroup(groupName);

		const box = new Box();

		box.length = boxDimension.length;
		box.width = boxDimension.width;
		box.height = boxDimension.height;
		box.stacks = [];

		return box;
	}

	getProducts(): Product[]
	{
		return this.stacks.reduce(
			(carryProducts: Product[], currentStack: ProductStack) => [...carryProducts, ...currentStack.getProducts()]
			, []
		)
	}

	reamingLength(): number
	{
		return this.length - this.usedLength;
	}

	addProduct(product: Product)
	{
		let selectedStack = this.getStackForProduct(product);

		try {
			selectedStack.addProduct(product);
		} catch (exception) {
			if (exception instanceof ProductStackOverflow){
				throw new StackBoxOverflow()
			}
			throw exception;
		}
	}

	getStackForProduct(product: Product): ProductStack
	{
		const stack = this.stacks.find(
			(stack: ProductStack) => stack.productFitsInThis(product)
		);

		return stack ?? this.createStackForGroup(product.groupLength)
	}

	createStackForGroup(groupName: GroupLengths): ProductStack
	{
        const service = new BoxDimensionsService();

		const dimensions = service.getAvailableGroupDimensions()[groupName];

		const productStack = ProductStack.makeProductStackFromDimensions({
			length: dimensions.maxLength,
			width: dimensions.maxWidth,
			height: this.height
		});

		this.addStack(productStack);	

		return productStack;
	}

	addStack(productStack: ProductStack)
	{
		if (productStack.maxLength > this.reamingLength()) {
			throw new StackBoxOverflow();
		}

		this.stacks.push(productStack);
		this.usedLength+=productStack.maxLength;
	}
}
