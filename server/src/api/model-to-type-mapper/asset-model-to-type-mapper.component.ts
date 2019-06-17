import {Injectable} from '@nestjs/common';
import {AssetInterface} from '../../persistence/interface/asset.interface';
import {AssetTypeInterface} from '../type/asset-type.interface';
import {DateConverter} from '../date-converter.component';

@Injectable()
export class AssetModelToTypeMapper {
    constructor(
        private readonly dateConverter: DateConverter,
    ) { }

    mapOne(asset: AssetInterface): AssetTypeInterface {
        return {
            id: asset.id,
            projectId: asset.projectId.toString(),
            description: asset.description,
            createdAt: this.dateConverter.convertDate(asset.createdAt),
            updatedAt: this.dateConverter.convertDate(asset.updatedAt),
        } as AssetTypeInterface;
    }

    mapMany(assets: AssetInterface[]): AssetTypeInterface[] {
        return assets.map(
            (asset: AssetInterface): AssetTypeInterface => {
                return this.mapOne(asset);
            },
        );
    }
}
