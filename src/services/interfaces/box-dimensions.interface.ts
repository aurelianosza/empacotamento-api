import { Product } from "src/models/product.model";
import { GroupLengths } from "src/types/product-group.type";
import { VolumeItem } from "src/types/volume-item.type";

export abstract class BoxDimensionsInterface {
    abstract getDimensionsForGroup(groupName: GroupLengths): VolumeItem;
    abstract organizeGroups(products: Product[]): Record<GroupLengths, Product[]>;
    abstract getAvailableGroupDimensions(): Array<VolumeItem>;
}
