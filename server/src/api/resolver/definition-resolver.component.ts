import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {DefinitionConfigMapper} from '../model-to-type-mapper/definition-config-mapper.component';
import {CreateDefinitionInputTypeInterface} from '../input-type/create-definition-input-type.interface';
import {ResolverPaginationArgumentsInterface} from '../pagination-argument/resolver-pagination-arguments.interface';
import {ResolverDefinitionFilterArgumentsInterface} from '../filter-argument/resolver-definition-filter-arguments.interface';
import {DeployKeyRepository} from '../../persistence/repository/deploy-key.repository';
import {SourceTypeInterface} from '../type/nested/definition-config/source-type.interface';
import {DeployKeyInterface} from '../../persistence/interface/deploy-key.interface';
import {DeployKeyTypeInterface} from '../type/deploy-key-type.interface';
import {PredictedEnvVariableTypeInterface} from '../type/predicted-env-variable-type.interface';
import {VariablesPredictor} from '../../instantiation/variable/variables-predictor';
import {PredictedFeaterVariableTypeInterface} from '../type/predicted-feater-variable-type.interface';
import {UpdateDefinitionInputTypeInterface} from '../input-type/update-definition-input-type.interface';
import {RemoveDefinitionInputTypeInterface} from '../input-type/remove-definition-input-type.interface';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver} from '@nestjs/graphql';
import {DefinitionLister} from '../lister/definition-lister.component';
import {DefinitionModelToTypeMapper} from '../model-to-type-mapper/definition-model-to-type-mapper.component';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {ProjectModelToTypeMapper} from '../model-to-type-mapper/project-model-to-type-mapper.component';
import {InstanceLister} from '../lister/instance-lister.component';
import {InstanceModelToTypeMapper} from '../model-to-type-mapper/instance-model-to-type-mapper.component';
import {InstanceTypeInterface} from '../type/instance-type.interface';
import {DeployKeyModelToTypeMapper} from '../model-to-type-mapper/deploy-key-model-to-type-mapper.service';
import * as escapeStringRegexp from 'escape-string-regexp';
import * as jsYaml from 'js-yaml';
import * as snakeCaseKeys from 'snakecase-keys';

@Resolver('Definition')
export class DefinitionResolver {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instanceRepository: InstanceRepository,
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly definitionConfigMapper: DefinitionConfigMapper,
        private readonly variablePredictor: VariablesPredictor,
        private readonly definitionLister: DefinitionLister,
        private readonly definitionModelToTypeMapper: DefinitionModelToTypeMapper,
        private readonly projectModelToTypeMapper: ProjectModelToTypeMapper,
        private readonly instanceLister: InstanceLister,
        private readonly instanceModelToTypeMapper: InstanceModelToTypeMapper,
        private readonly deployKeyModelToTypeMapper: DeployKeyModelToTypeMapper,
    ) { }

    @Query('definitions')
    async getAll(
        @Args() args: any,
    ): Promise<DefinitionTypeInterface[]> {
        const criteria = this.applyDefinitionFilterArgumentToCriteria({}, args as ResolverDefinitionFilterArgumentsInterface);
        const definitions = await this.definitionLister.getList(criteria, args as ResolverPaginationArgumentsInterface);

        return this.definitionModelToTypeMapper.mapMany(definitions);
    }

    @Query('definition')
    async getOne(
        @Args('id') id: string,
    ): Promise<DefinitionTypeInterface> {
        const definition = await this.definitionRepository.findById(id);

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @ResolveProperty('project')
    async getProject(
        @Parent() definition: DefinitionTypeInterface,
    ): Promise<ProjectTypeInterface> {
        const project = await this.projectRepository.findById(definition.projectId);

        return this.projectModelToTypeMapper.mapOne(project);
    }

    @ResolveProperty('instances')
    async getInstances(
        @Parent() definition: DefinitionTypeInterface,
        @Args() args: any,
    ): Promise<InstanceTypeInterface[]> {
        const criteria = {definitionId: definition.id};
        const instances = await this.instanceLister.getList(criteria, args as ResolverPaginationArgumentsInterface);

        return this.instanceModelToTypeMapper.mapMany(instances);
    }

    @ResolveProperty('deployKeys')
    async getDeployKeys(
        @Parent() definition: DefinitionTypeInterface,
    ): Promise<DeployKeyTypeInterface[]> {
        const deployKeys: DeployKeyInterface[] = [];
        for (const source of definition.config.sources) {
            const sourceDeployKeys = await this.deployKeyRepository.findByCloneUrl((source as SourceTypeInterface).cloneUrl);
            if (1 < sourceDeployKeys.length) {
                throw new Error('More than one deploy key found.');
            }
            if (1 === sourceDeployKeys.length) {
                deployKeys.push(sourceDeployKeys[0]);
            }
        }

        return this.deployKeyModelToTypeMapper.mapMany(deployKeys);
    }

    @ResolveProperty('predictedEnvVariables')
    async getPredictedEnvVariables(
        @Parent() definition: DefinitionTypeInterface,
    ): Promise<PredictedEnvVariableTypeInterface[]> {
        const predictedEnvVariables = this.variablePredictor.predictEnvVariables(definition.config);
        const mappedPredictedEnvVariables: PredictedEnvVariableTypeInterface[] = [];

        for (const predictedEnvVariable of predictedEnvVariables) {
            mappedPredictedEnvVariables.push({
                name: predictedEnvVariable.name,
                value: predictedEnvVariable.value,
                pattern: predictedEnvVariable.pattern,
            });
        }

        return mappedPredictedEnvVariables;
    }

    @ResolveProperty('predictedFeaterVariables')
    async getPredictedFeaterVariables(
        @Parent() definition: DefinitionTypeInterface,
    ): Promise<PredictedFeaterVariableTypeInterface[]> {
        const predictedFeaterVariables = this.variablePredictor.predictFeaterVariables(definition.config);
        const mappedPredictedFeaterVariables: PredictedFeaterVariableTypeInterface[] = [];

        for (const predictedFeaterVariable of predictedFeaterVariables) {
            mappedPredictedFeaterVariables.push({
                name: predictedFeaterVariable.name,
                value: predictedFeaterVariable.value,
                pattern: predictedFeaterVariable.pattern,
            });
        }

        return mappedPredictedFeaterVariables;
    }

    @Mutation('createDefinition')
    async create(
        @Args() createDefinitionInput: CreateDefinitionInputTypeInterface,
    ): Promise<DefinitionTypeInterface> {
        // TODO Add input validation.
        await this.projectRepository.findByIdOrFail(createDefinitionInput.projectId);
        const definition = await this.definitionRepository.create(createDefinitionInput);

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @Mutation('updateDefinition')
    async update(
        @Args() updateDefinitionInput: UpdateDefinitionInputTypeInterface,
    ): Promise<DefinitionTypeInterface> {
        // TODO Add input validation.
        const definition = await this.definitionRepository.update(updateDefinitionInput.id, updateDefinitionInput);

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @Mutation('removeDefinition')
    async remove(
        @Args() removeDefinitionInput: RemoveDefinitionInputTypeInterface,
    ): Promise<boolean> {
        const definition = await this.definitionRepository.findByIdOrFail(removeDefinitionInput.id);
        const instances = await this.instanceRepository.find({definitionId: definition.id}, 0, 1);
        if (!!instances.length) {
            throw new Error('Definition has some instances.');
        }

        return await this.definitionRepository.remove(removeDefinitionInput.id);
    }

    @ResolveProperty('configAsYaml')
    getConfigAsYaml(@Parent() definition: DefinitionTypeInterface): string {
        return jsYaml.safeDump(
            snakeCaseKeys(definition.config),
            {
                indent: 4,
                flowLevel: -1,
            },
        );
    }

    // TODO Move somewhere else.
    protected applyDefinitionFilterArgumentToCriteria(criteria: any, args: ResolverDefinitionFilterArgumentsInterface): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }
}
