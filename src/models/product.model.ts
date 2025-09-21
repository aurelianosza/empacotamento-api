import { GroupLengths, ProductGroup } from "src/types/product-group.type";
import { VolumeItem } from "src/types/volume-item.type";

export class Product implements VolumeItem  {
    id: string;
	width: number;
    length: number;
    height: number;

	groupLength: GroupLengths;

	static make(data: VolumeItem & {id: string}): Product
	{
		const product = new Product();
		Object.assign(product, data);

		return product;
	}

    setLength(groupName: GroupLengths): void
    {
        this.groupLength = groupName;
    }

	/** flip product, to set their dimensions in this way length >= width >= height */
	normalize(): Product
	{
		 const { length, width, height } = this;

    	const dims = [length, width, height];
		const sorted = dims.sort((a, b) => b - a);

		this.length = sorted[0];
		this.width = sorted[1];
		this.height = sorted[2];

		return this;
	}

	rotate(): Product
	{
		const width = this.length;
		this.length = this.width;
		this.width = width;

		return this;
	}

	fitInGroup(group: ProductGroup): boolean 
	{
		if (this.length <= group.maxWidth) {
			return true;
		}

		return this.length <= group.maxLength
			&& this.width <= group.maxWidth;
	}
}
