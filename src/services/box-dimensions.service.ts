import { GroupLengths, ProductGroup } from "src/types/product-group.type";
import { VolumeItem } from "src/types/volume-item.type";
import { BoxDimensionsInterface } from "./interfaces/box-dimensions.interface";
import { Product } from "src/models/product.model";

export class BoxDimensionsService implements BoxDimensionsInterface {

    static productGroupDimensions : Record<GroupLengths, ProductGroup> = {
        micro: {
            maxWidth: 10,
            maxLength: 20
        },
        mini : {
            maxWidth: 20,
            maxLength: 30
        },
        medium: {
            maxWidth: 30,
            maxLength: 50
        },
        large: {
            maxWidth: 40,
            maxLength: 60
        },
        huge: {
            maxWidth: 50,
            maxLength: 80
        },
        colossus : {
            maxWidth: Infinity,
            maxLength: Infinity
        }
    };

    static availableBoxesDimensions: Array<VolumeItem> =  [
        {
            width: 40,
            length: 80,
            height: 30,
        },
        {
            width: 50,
            length: 50,
            height: 40,
        },
        {
            width: 50,
            length: 80,
            height: 60,
        }
    ];

    getDimensionsForGroup(groupName: GroupLengths): VolumeItem {
        if (groupName == "colossus") {
            throw new Error("doesnt have box to colossus group");
        }
        
        const group = BoxDimensionsService.productGroupDimensions[groupName];

        return BoxDimensionsService.availableBoxesDimensions.find(
            (box) => box.length >= group.maxLength && box.width >= group.maxWidth
        )!;
    }

    organizeGroups(products: Product[]): Record<GroupLengths, Product[]> {
        const grouped = {} as  Record<GroupLengths, Product[]>;

        for (const product of products) {
            for (
                const [group, dimensions] of Object.entries(BoxDimensionsService.productGroupDimensions) as [[GroupLengths, ProductGroup]]
            ) {
                product.normalize();
                if (product.fitInGroup(dimensions)) {
                    product.setLength(group)

                    if (!grouped[group]) {
                        grouped[group] = [];
                    }
                    grouped[group].push(product);
                    break;
                }
            }
        }

        return grouped;
    }

    getAvailableGroupDimensions(): Array<VolumeItem>
    {
        return BoxDimensionsService.availableBoxesDimensions;
    }
}
