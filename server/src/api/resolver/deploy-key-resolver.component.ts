import { DeployKeyTypeInterface } from '../type/deploy-key-type.interface';
import { DeployKeyRepository } from '../../persistence/repository/deploy-key.repository';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';
import { ResolverDeployKeyFilterArgumentsInterface } from '../filter-argument/resolver-deploy-key-filter-arguments.interface';
import { RegenerateDeployKeyInputTypeInterface } from '../input-type/regenerate-deploy-key-input-type.interface';
import { RemoveDeployKeyInputTypeInterface } from '../input-type/remove-deploy-key-input-type.interface';
import { DefinitionRepository } from '../../persistence/repository/definition.repository';
import { SourceTypeInterface } from '../type/nested/definition-recipe/source-type.interface';
import { DeployKeyHelperComponent } from '../../helper/deploy-key-helper.component';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeployKeyLister } from '../lister/deploy-key-lister.component';
import { DeployKeyModelToTypeMapper } from '../model-to-type-mapper/deploy-key-model-to-type-mapper.service';
import { unlinkSync } from 'fs';
import * as _ from 'lodash';
import { RecipeMapper } from '../recipe/schema-version/0-1/recipe-mapper';

@Resolver('DeployKey')
export class DeployKeyResolver {
    constructor(
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly deployKeyHelper: DeployKeyHelperComponent,
        private readonly deployKeyLister: DeployKeyLister,
        private readonly deployKeyModelToTypeMapper: DeployKeyModelToTypeMapper,
        private readonly recipeMapper: RecipeMapper,
    ) {}

    @Query('deployKeys')
    async getAll(@Args() args: unknown): Promise<DeployKeyTypeInterface[]> {
        const resolverListOptions = args as ResolverPaginationArgumentsInterface;
        const criteria = this.applyFilterArgumentToCriteria(
            {},
            args as ResolverDeployKeyFilterArgumentsInterface,
        );
        const deployKeys = await this.deployKeyLister.getList(
            criteria,
            args as ResolverPaginationArgumentsInterface,
        );

        return this.deployKeyModelToTypeMapper.mapMany(deployKeys);
    }

    @Query('deployKey')
    async getOne(@Args('id') id: string): Promise<DeployKeyTypeInterface> {
        const deployKey = await this.deployKeyRepository.findOneById(id);

        return this.deployKeyModelToTypeMapper.mapOne(deployKey);
    }

    @Mutation('regenerateDeployKey')
    async regenerateOne(
        @Args() regenerateDeployKeyInput: RegenerateDeployKeyInputTypeInterface,
    ): Promise<DeployKeyTypeInterface> {
        // TODO Extract somewhere else.

        const deployKey = await this.deployKeyRepository.create(
            regenerateDeployKeyInput.cloneUrl,
            true,
        );

        return this.deployKeyModelToTypeMapper.mapOne(deployKey);
    }

    @Mutation('generateMissingDeployKeys')
    async generateAllMissing(): Promise<object> {
        // TODO Extract somewhere else.

        const definitions = await this.definitionRepository.find({}, 0, 99999);
        const referencedCloneUrls = [];
        for (const definition of definitions) {
            const definitionRecipe = this.recipeMapper.map(
                definition.recipeAsYaml,
            );
            for (const source of definitionRecipe.sources) {
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

        const missingReferencedCloneUrls = _.difference(
            _.uniq(referencedCloneUrls),
            existingDeployKeyCloneUrls,
        );
        const createPromises = [];
        for (const missingReferencedCloneUrl of missingReferencedCloneUrls) {
            createPromises.push(
                this.deployKeyRepository.create(missingReferencedCloneUrl),
            );
        }
        await Promise.all(createPromises);

        return { generated: true };
    }

    @Mutation('removeUnusedDeployKeys')
    async removeAllUnused(): Promise<object> {
        // TODO Extract somewhere else.

        const deployKeys = await this.deployKeyRepository.find({}, 0, 99999);
        const definitions = await this.definitionRepository.find({}, 0, 99999);

        const cloneUrls = [];
        for (const deployKey of deployKeys) {
            cloneUrls.push(deployKey.cloneUrl);
        }

        const referencedCloneUrls = [];
        for (const definition of definitions) {
            const definitionRecipe = this.recipeMapper.map(
                definition.recipeAsYaml,
            );
            for (const source of definitionRecipe.sources) {
                const cloneUrl = (source as SourceTypeInterface).cloneUrl;
                if ((source as SourceTypeInterface).useDeployKey) {
                    referencedCloneUrls.push(cloneUrl);
                }
            }
        }

        const unreferencedCloneUrls = _.difference(
            cloneUrls,
            referencedCloneUrls,
        );
        const removePromises = [];
        for (const unreferencedCloneUrl of unreferencedCloneUrls) {
            removePromises.push(
                this.deployKeyRepository.remove(unreferencedCloneUrl),
            );
            unlinkSync(
                this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(
                    unreferencedCloneUrl,
                ),
            );
        }
        await Promise.all(removePromises);

        return { removed: true };
    }

    @Mutation('removeDeployKey')
    async removeOne(
        @Args() removeDeployKeyInput: RemoveDeployKeyInputTypeInterface,
    ): Promise<object> {
        await this.deployKeyRepository.remove(removeDeployKeyInput.cloneUrl);
        unlinkSync(
            this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(
                removeDeployKeyInput.cloneUrl,
            ),
        );

        return { removed: true };
    }

    // TODO Move somewhere else.
    private applyFilterArgumentToCriteria(
        criteria: unknown,
        args: ResolverDeployKeyFilterArgumentsInterface,
    ): unknown {
        return criteria;
    }
}
