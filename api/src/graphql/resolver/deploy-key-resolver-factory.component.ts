import {Component} from '@nestjs/common';
import {DeployKeyTypeInterface} from '../type/deploy-key-type.interface';
import {DeployKeyRepository} from '../../persistence/repository/deploy-key.repository';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverDeployKeyFilterArgumentsInterface} from './filter-argument/resolver-deploy-key-filter-arguments.interface';
import * as escapeStringRegexp from 'escape-string-regexp';
import * as sshFingerprint from 'ssh-fingerprint';
import {DeployKeyInterface} from '../../persistence/interface/deploy-key.interface';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {CreateDefinitionInputTypeInterface} from '../input-type/create-definition-input-type.interface';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {RegenerateDeployKeyInputTypeInterface} from '../input-type/regenerate-deploy-key-input-type.interface';

@Component()
export class DeployKeyResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly deployKeyRepository: DeployKeyRepository,
    ) { }

    protected readonly defaultSortKey = 'created_at_asc';

    protected readonly sortMap = {
        created_at_asc: {
            createdAt: 'asc',
            _id: 'desc',
        },
        created_at_desc: {
            createdAt: 'desc',
            _id: 'desc',
        },
    };

    getListResolver(queryExtractor?: (object: object) => object): (object: object, args: object) => Promise<DeployKeyTypeInterface[]> {
        return async (object: object, args: object): Promise<DeployKeyTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverDeployKeyFilterArgumentsInterface,
            );
            const deployKeys = await this.deployKeyRepository.find(
                criteria,
                this.resolveListOptionsHelper.getOffset(resolverListOptions.offset),
                this.resolveListOptionsHelper.getLimit(resolverListOptions.limit),
                this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, resolverListOptions.sortKey),
            );
            const data: DeployKeyTypeInterface[] = [];
            for (const deployKey of deployKeys) {
                data.push(this.mapPersistentModelToTypeModel(deployKey));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (obj: any, args: any) => string): (obj: any, args: any) => Promise<DeployKeyTypeInterface> {
        return async (obj: any, args: any): Promise<DeployKeyTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.deployKeyRepository.findById(idExtractor(obj, args)),
            );
        };
    }

    getItemFingerprintResolver(): (object: DeployKeyInterface, args: object) => Promise<string> {
        return async (object: DeployKeyInterface, args: object): Promise<string> => {
            return sshFingerprint(object.publicKey);
        };
    }

    getRegenerateItemResolver(): (obj: any, regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface) => Promise<DeployKeyTypeInterface> {
        return async (obj: any, regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface): Promise<DeployKeyTypeInterface> => {
            const deployKey = await this.deployKeyRepository.create(regenerateDeployKeyInput.id, true);

            return this.mapPersistentModelToTypeModel(deployKey);
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverDeployKeyFilterArgumentsInterface): object {
        return criteria;
    }

    protected mapPersistentModelToTypeModel(deployKey: DeployKeyInterface): DeployKeyTypeInterface {
        return {
            id: deployKey._id.toString(),
            sshCloneUrl: deployKey.sshCloneUrl,
            publicKey: deployKey.publicKey,
        } as DeployKeyTypeInterface;
    }
}
