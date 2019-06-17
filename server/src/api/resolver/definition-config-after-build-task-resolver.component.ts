import {ResolveProperty, Resolver} from '@nestjs/graphql';
import {AfterBuildTaskTypeInterface} from '../type/nested/definition-config/after-build-task-type.interface';

@Resolver('DefinitionConfigAfterBuildTask')
export class DefinitionConfigAfterBuildTaskResolver {
    @ResolveProperty()
    __resolveType(afterBuildTask: AfterBuildTaskTypeInterface): string {
        switch (afterBuildTask.type) {
            case 'executeServiceCommand':
                return 'ExecuteServiceCommandAfterBuildTask';

            case 'copyAssetIntoContainer':
                return 'CopyAssetIntoContainerAfterBuildTask';
        }

        throw new Error();
    }
}
