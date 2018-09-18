import {Component} from '@nestjs/common';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {DefinitionConfigMapper} from './definition-config-mapper.component';
import {DefinitionInterface} from '../../persistence/interface/definition.interface';
import {CreateDefinitionInputTypeInterface} from '../input-type/create-definition-input-type.interface';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverDefinitionFilterArgumentsInterface} from './filter-argument/resolver-definition-filter-arguments.interface';
import {DeployKeyRepository} from '../../persistence/repository/deploy-key.repository';
import * as escapeStringRegexp from 'escape-string-regexp';
import * as jsYaml from 'js-yaml';
import * as gitUrlParse from 'git-url-parse';
import {SourceTypeInterface} from '../type/nested/definition-config/source-type.interface';
import {DeployKeyInterface} from '../../persistence/interface/deploy-key.interface';

@Component()
export class DefinitionResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly definitionRepository: DefinitionRepository,
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly definitionConfigMapper: DefinitionConfigMapper,
    ) { }

    protected readonly defaultSortKey = 'name_asc';

    protected readonly sortMap = {
        name_asc: {
            name: 'asc',
            createdAt: 'desc',
            _id: 'desc',
        },
        name_desc: {
            name: 'desc',
            createdAt: 'desc',
            _id: 'desc',
        },
        created_at_asc: {
            createdAt: 'asc',
            _id: 'desc',
        },
        created_at_desc: {
            createdAt: 'desc',
            _id: 'desc',
        },
    };

    public getListResolver(queryExtractor?: (object: object) => object): (object: object, args: object) => Promise<DefinitionTypeInterface[]> {
        return async (object: object, args: object): Promise<DefinitionTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverDefinitionFilterArgumentsInterface,
            );
            const definitions = await this.definitionRepository.find(
                criteria,
                this.resolveListOptionsHelper.getOffset(resolverListOptions.offset),
                this.resolveListOptionsHelper.getLimit(resolverListOptions.limit),
                this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, resolverListOptions.sortKey),
            );
            const data: DefinitionTypeInterface[] = [];
            for (const definition of definitions) {
                data.push(this.mapPersistentModelToTypeModel(definition));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (obj: any, args: any) => string): (obj: any, args: any) => Promise<DefinitionTypeInterface> {
        return async (obj: any, args: any): Promise<DefinitionTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.definitionRepository.findById(idExtractor(obj, args)),
            );
        };
    }

    public getCreateItemResolver(): (obj: any, createDefinitionInput: CreateDefinitionInputTypeInterface) => Promise<DefinitionTypeInterface> {
        return async (obj: any, createDefinitionInput: CreateDefinitionInputTypeInterface): Promise<DefinitionTypeInterface> => {
            // TODO Add validation.
            const definition = await this.definitionRepository.create(createDefinitionInput);

            return this.mapPersistentModelToTypeModel(definition);
        };
    }

    public getConfigAsYamlResolver(): (obj: any, args: any) => string {
        return (obj: any, args: any): string => {
            return jsYaml.safeDump(obj.config, {indent: 4});
        };
    }

    public getDeployKeysResolver(): (obj: DefinitionInterface, args: any) => Promise<DeployKeyInterface[]> {
        return async (obj: DefinitionInterface, args: any): Promise<DeployKeyInterface[]> => {
            const deployKeys: DeployKeyInterface[] = [];
            for (const source of obj.config.sources) {
                const {owner: repositoryOwner, name: repositoryName} = gitUrlParse((source as SourceTypeInterface).sshCloneUrl);
                deployKeys.push(await this.deployKeyRepository.findByRepositoryOwnerAndName(repositoryOwner, repositoryName));
            }

            return deployKeys;
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverDefinitionFilterArgumentsInterface): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }

    protected mapPersistentModelToTypeModel(definition: DefinitionInterface): DefinitionTypeInterface {
        return {
            id: definition._id,
            name: definition.name,
            projectId: definition.projectId,
            config: this.definitionConfigMapper.map(definition.config),
        } as DefinitionTypeInterface;
    }
}
