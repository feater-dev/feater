import {ResolveProperty, Resolver} from '@nestjs/graphql';
import {BeforeBuildTaskTypeInterface} from '../type/nested/definition-config/before-build-task-type.interface';

@Resolver('DefinitionConfigSourceBeforeBuildTask')
export class DefinitionConfigSourceBeforeBuildTaskResolver {
    @ResolveProperty()
    __resolveType(beforeBuildTask: BeforeBuildTaskTypeInterface): string {
        if ('copy' === beforeBuildTask.type) {
            return 'CopyBeforeBuildTask';
        }
        if ('interpolate' === beforeBuildTask.type) {
            return 'InterpolateBeforeBuildTask';
        }

        throw new Error();
    }
}
