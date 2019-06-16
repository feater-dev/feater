// TODO Refactor and remove.

import {Injectable} from '@nestjs/common';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {ProjectInterface} from '../../persistence/interface/project.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';

@Injectable()
export class ProjectsResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly projectRepository: ProjectRepository,
    ) { }

    public getItemResolver(idExtractor: (obj: any, args: any) => string): (obj: any, args: any) => Promise<ProjectTypeInterface> {
        return async (obj: any, args: any): Promise<ProjectTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.projectRepository.findById(idExtractor(obj, args)),
            );
        };
    }

    protected mapPersistentModelToTypeModel(project: ProjectInterface): ProjectTypeInterface {
        // Moved.
        return {} as ProjectTypeInterface;
    }
}
