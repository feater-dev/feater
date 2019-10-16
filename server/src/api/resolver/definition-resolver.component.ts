import { DefinitionTypeInterface } from '../type/definition-type.interface';
import { DefinitionRepository } from '../../persistence/repository/definition.repository';
import { CreateDefinitionInputTypeInterface } from '../input-type/create-definition-input-type.interface';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';
import { ResolverDefinitionFilterArgumentsInterface } from '../filter-argument/resolver-definition-filter-arguments.interface';
import { DeployKeyRepository } from '../../persistence/repository/deploy-key.repository';
import { SourceTypeInterface } from '../type/nested/definition-recipe/source-type.interface';
import { DeployKeyInterface } from '../../persistence/interface/deploy-key.interface';
import { DeployKeyTypeInterface } from '../type/deploy-key-type.interface';
import { PredictedEnvVariableTypeInterface } from '../type/predicted-env-variable-type.interface';
import { VariablesPredictor } from '../../instantiation/variable/variables-predictor';
import { PredictedFeaterVariableTypeInterface } from '../type/predicted-feater-variable-type.interface';
import { UpdateDefinitionInputTypeInterface } from '../input-type/update-definition-input-type.interface';
import { RemoveDefinitionInputTypeInterface } from '../input-type/remove-definition-input-type.interface';
import { InstanceRepository } from '../../persistence/repository/instance.repository';
import { ProjectRepository } from '../../persistence/repository/project.repository';
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveProperty,
    Resolver,
} from '@nestjs/graphql';
import { DefinitionLister } from '../lister/definition-lister.component';
import { DefinitionModelToTypeMapper } from '../model-to-type-mapper/definition-model-to-type-mapper.component';
import { ProjectTypeInterface } from '../type/project-type.interface';
import { ProjectModelToTypeMapper } from '../model-to-type-mapper/project-model-to-type-mapper.component';
import { InstanceLister } from '../lister/instance-lister.component';
import { InstanceModelToTypeMapper } from '../model-to-type-mapper/instance-model-to-type-mapper.component';
import { InstanceTypeInterface } from '../type/instance-type.interface';
import { DeployKeyModelToTypeMapper } from '../model-to-type-mapper/deploy-key-model-to-type-mapper.service';
import * as escapeStringRegexp from 'escape-string-regexp';
import { RecipeMapper } from '../recipe/schema-version/0-1/recipe-mapper';
import { RecipeValidator } from '../recipe/schema-version/0-1/recipe-validator';

@Resolver('Definition')
export class DefinitionResolver {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instanceRepository: InstanceRepository,
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly definitionRecipeMapper: RecipeMapper,
        private readonly variablePredictor: VariablesPredictor,
        private readonly definitionLister: DefinitionLister,
        private readonly definitionModelToTypeMapper: DefinitionModelToTypeMapper,
        private readonly projectModelToTypeMapper: ProjectModelToTypeMapper,
        private readonly instanceLister: InstanceLister,
        private readonly instanceModelToTypeMapper: InstanceModelToTypeMapper,
        private readonly deployKeyModelToTypeMapper: DeployKeyModelToTypeMapper,
        private readonly recipeValidator: RecipeValidator,
    ) {}

    @Query('definitions')
    async getAll(@Args() args: any): Promise<DefinitionTypeInterface[]> {
        const criteria = this.applyDefinitionFilterArgumentToCriteria(
            {},
            args as ResolverDefinitionFilterArgumentsInterface,
        );
        const definitions = await this.definitionLister.getList(
            criteria,
            args as ResolverPaginationArgumentsInterface,
        );

        return this.definitionModelToTypeMapper.mapMany(definitions);
    }

    @Query('definition')
    async getOne(@Args('id') id: string): Promise<DefinitionTypeInterface> {
        const definition = await this.definitionRepository.findById(id);

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @ResolveProperty('project')
    async getProject(
        @Parent() definition: DefinitionTypeInterface,
    ): Promise<ProjectTypeInterface> {
        const project = await this.projectRepository.findByIdOrFail(
            definition.projectId,
        );

        return this.projectModelToTypeMapper.mapOne(project);
    }

    @ResolveProperty('instances')
    async getInstances(
        @Parent() definition: DefinitionTypeInterface,
        @Args() args: any,
    ): Promise<InstanceTypeInterface[]> {
        const instances = await this.instanceLister.getList(
            { definitionId: definition.id },
            args as ResolverPaginationArgumentsInterface,
        );

        const mappedInstances: InstanceTypeInterface[] = [];
        for (const instance of instances) {
            const definition = await this.definitionRepository.findByIdOrFail(
                instance.definitionId,
            );
            mappedInstances.push(
                this.instanceModelToTypeMapper.mapOne(instance, definition),
            );
        }

        return mappedInstances;
    }

    @ResolveProperty('deployKeys')
    async getDeployKeys(
        @Parent() definition: DefinitionTypeInterface,
    ): Promise<DeployKeyTypeInterface[]> {
        const definitionRecipe = this.definitionRecipeMapper.map(
            definition.recipeAsYaml,
        );
        const deployKeys: DeployKeyInterface[] = [];
        for (const source of definitionRecipe.sources) {
            const sourceDeployKeys = await this.deployKeyRepository.findByCloneUrl(
                source.cloneUrl,
            );
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
        const definitionRecipe = this.definitionRecipeMapper.map(
            definition.recipeAsYaml,
        );
        const predictedEnvVariables = this.variablePredictor.predictEnvVariables(
            definitionRecipe,
        );
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
        const definitionRecipe = this.definitionRecipeMapper.map(
            definition.recipeAsYaml,
        );
        const predictedFeaterVariables = this.variablePredictor.predictFeaterVariables(
            definitionRecipe,
        );
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
        await this.projectRepository.findByIdOrFail(
            createDefinitionInput.projectId,
        );

        const validationResult = this.recipeValidator.validateRecipe(
            createDefinitionInput.recipeAsYaml,
        );
        if (validationResult.error) {
            throw new Error('Invalid definition recipe.');
        }

        const definition = await this.definitionRepository.create(
            createDefinitionInput.projectId,
            createDefinitionInput.name,
            createDefinitionInput.recipeAsYaml,
        );

        const recipe = this.definitionRecipeMapper.map(definition.recipeAsYaml);
        for (const source of recipe.sources) {
            const cloneUrl = (source as SourceTypeInterface).cloneUrl;
            if ((source as SourceTypeInterface).useDeployKey) {
                const deployKeyExists = await this.deployKeyRepository.existsForCloneUrl(
                    cloneUrl,
                );
                if (!deployKeyExists) {
                    await this.deployKeyRepository.create(cloneUrl);
                }
            }
        }

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @Mutation('updateDefinition')
    async update(
        @Args() updateDefinitionInput: UpdateDefinitionInputTypeInterface,
    ): Promise<DefinitionTypeInterface> {
        const definition = await this.definitionRepository.update(
            updateDefinitionInput.id,
            updateDefinitionInput.name,
            updateDefinitionInput.recipeAsYaml,
        );

        const validationResult = this.recipeValidator.validateRecipe(
            updateDefinitionInput.recipeAsYaml,
        );
        if (validationResult.error) {
            throw new Error('Invalid definition recipe.');
        }

        const recipe = this.definitionRecipeMapper.map(definition.recipeAsYaml);
        for (const source of recipe.sources) {
            const cloneUrl = (source as SourceTypeInterface).cloneUrl;
            if ((source as SourceTypeInterface).useDeployKey) {
                const deployKeyExists = await this.deployKeyRepository.existsForCloneUrl(
                    cloneUrl,
                );
                if (!deployKeyExists) {
                    await this.deployKeyRepository.create(cloneUrl);
                }
            }
        }

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @Mutation('removeDefinition')
    async remove(
        @Args() removeDefinitionInput: RemoveDefinitionInputTypeInterface,
    ): Promise<boolean> {
        const definition = await this.definitionRepository.findByIdOrFail(
            removeDefinitionInput.id,
        );
        const instances = await this.instanceRepository.find(
            { definitionId: definition.id },
            0,
            1,
        );
        if (!!instances.length) {
            throw new Error('Definition has some instances.');
        }

        return await this.definitionRepository.remove(removeDefinitionInput.id);
    }

    // TODO Move somewhere else.
    protected applyDefinitionFilterArgumentToCriteria(
        criteria: any,
        args: ResolverDefinitionFilterArgumentsInterface,
    ): any {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }
}
