import * as sshFingerprint from 'ssh-fingerprint';
import * as _ from 'lodash';
import {unlinkSync} from 'fs';
import {Injectable} from '@nestjs/common';
import {DeployKeyTypeInterface} from '../type/deploy-key-type.interface';
import {DeployKeyRepository} from '../../persistence/repository/deploy-key.repository';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverDeployKeyFilterArgumentsInterface} from './filter-argument/resolver-deploy-key-filter-arguments.interface';
import {DeployKeyInterface} from '../../persistence/interface/deploy-key.interface';
import {RegenerateDeployKeyInputTypeInterface} from '../input-type/regenerate-deploy-key-input-type.interface';
import {RemoveDeployKeyInputTypeInterface} from '../input-type/remove-deploy-key-input-type.interface';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {SourceTypeInterface} from '../type/nested/definition-config/source-type.interface';
import {DeployKeyHelperComponent} from '../../helper/deploy-key-helper.component';

@Injectable()
export class DeployKeyResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly deployKeyHelper: DeployKeyHelperComponent,
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
                await this.deployKeyRepository.findOneById(idExtractor(obj, args)),
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
            const deployKey = await this.deployKeyRepository.create(regenerateDeployKeyInput.cloneUrl, true);

            return this.mapPersistentModelToTypeModel(deployKey);
        };
    }

    getGenerateMissingItemsResolver(): (obj: any, regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface) => Promise<object> {
        return async (obj: any, regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface): Promise<object> => {
            const definitions = await this.definitionRepository.find({}, 0, 99999);
            const referencedCloneUrls = [];
            for (const definition of definitions) {
                for (const source of definition.config.sources) {
                    const cloneUrl = (source as SourceTypeInterface).cloneUrl;
                    if ((source as SourceTypeInterface).useDeployKey) {
                        referencedCloneUrls.push(cloneUrl);
                    }
                }
            }

            const deployKeys = await this.deployKeyRepository.find({}, 0, 99999);
            const existingDeployKeyCloneUrls = [];
            for (const deployKey of deployKeys) {
                existingDeployKeyCloneUrls.push(deployKey.cloneUrl);
            }

            const missingReferencedCloneUrls = _.difference(_.uniq(referencedCloneUrls), existingDeployKeyCloneUrls);
            const createPromises = [];
            for (const missingReferencedCloneUrl of missingReferencedCloneUrls) {
                createPromises.push(this.deployKeyRepository.create(missingReferencedCloneUrl));
            }
            await Promise.all(createPromises);

            return {generated: true};
        };
    }

    getRemoveUnusedItemsResolver(): (obj: any, regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface) => Promise<object> {
        return async (obj: any, regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface): Promise<object> => {
            const deployKeys = await this.deployKeyRepository.find({}, 0, 99999);
            const definitions = await this.definitionRepository.find({}, 0, 99999);

            const cloneUrls = [];
            for (const deployKey of deployKeys) {
                cloneUrls.push(deployKey.cloneUrl);
            }

            const referencedCloneUrls = [];
            for (const definition of definitions) {
                for (const source of definition.config.sources) {
                    const cloneUrl = (source as SourceTypeInterface).cloneUrl;
                    if ((source as SourceTypeInterface).useDeployKey) {
                        referencedCloneUrls.push(cloneUrl);
                    }
                }
            }

            const unreferencedCloneUrls = _.difference(cloneUrls, referencedCloneUrls);
            const removePromises = [];
            for (const unreferencedCloneUrl of unreferencedCloneUrls) {
                removePromises.push(this.deployKeyRepository.remove(unreferencedCloneUrl));
                unlinkSync(this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(unreferencedCloneUrl));
            }
            await Promise.all(removePromises);

            return {removed: true};
        };
    }

    getRemoveItemResolver(): (obj: any, removeDeployKeyInput: RemoveDeployKeyInputTypeInterface) => Promise<object> {
        return async (obj: any, removeDeployKeyInput: RemoveDeployKeyInputTypeInterface): Promise<object> => {
            await this.deployKeyRepository.remove(removeDeployKeyInput.cloneUrl);
            unlinkSync(this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(removeDeployKeyInput.cloneUrl));

            return {removed: true};
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverDeployKeyFilterArgumentsInterface): object {
        return criteria;
    }

    protected mapPersistentModelToTypeModel(deployKey: DeployKeyInterface): DeployKeyTypeInterface {
        return {
            id: deployKey._id.toString(),
            cloneUrl: deployKey.cloneUrl,
            publicKey: deployKey.publicKey,
            createdAt: deployKey.createdAt,
            updatedAt: deployKey.updatedAt,
        } as DeployKeyTypeInterface;
    }
}
