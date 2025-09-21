import { ProductGroup } from "src/types/product-group.type";
import { VolumeItem } from "src/types/volume-item.type";
import { Product } from "./product.model";
import { ProductStackOverflow } from "src/exceptions/product-stack-overflow";

export class ProductStack implements ProductGroup {
	subStacks: ProductStack[] = [];
	products: Product[] = [];
	
	maxLength: number;
	maxWidth:number;

	maxHeight: number;
	usedHeight: number = 0;

	static makeProductStackFromDimensions(data: VolumeItem): ProductStack 
	{
		const productStack = new ProductStack();

		productStack.maxLength = data.length;
		productStack.maxWidth = data.width;
		productStack.maxHeight = data.height;

		return productStack;
	}

	reamingHeight(): number
	{
		return this.maxHeight - this.usedHeight;
	}

	productFitsInThis(product: Product): boolean
	{
		return this.reamingHeight() >= product.height
			&& product.fitInGroup(this);
	}

	addProduct(product: Product): ProductStack
	{
		if (!this.productFitsInThis(product)) {
			throw new ProductStackOverflow();
		}

		this.products.push(product);
		this.usedHeight+=product.height;

		return this;
	}

	getProducts(): Product[]
	{
		return this.products;
	}
}
