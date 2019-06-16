import {Injectable} from '@nestjs/common';
import {AssetInterface} from '../../persistence/interface/asset.interface';
import {AssetTypeInterface} from '../type/asset-type.interface';

@Injectable()
export class AssetModelToTypeMapper {
    public mapOne(asset: AssetInterface): AssetTypeInterface {
        return {
            id: asset.id,
            projectId: asset.projectId.toString(),
            description: asset.description,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
        } as AssetTypeInterface;
    }

    public mapMany(assets: AssetInterface[]): AssetTypeInterface[] {
        return assets.map(
            (asset: AssetInterface): AssetTypeInterface => {
                return this.mapOne(asset);
            },
        );
    }
}
