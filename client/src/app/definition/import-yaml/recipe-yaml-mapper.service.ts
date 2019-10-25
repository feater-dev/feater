import { Injectable } from '@angular/core';
import { RecipeFormElement } from '../recipe-form/recipe-form.model';
import * as jsYaml from 'js-yaml';
import * as _ from 'lodash';
import { CamelCaseConverter } from './camel-case-converter';

@Injectable()
export class RecipeYamlMapperService {
    readonly defaultNginxConfigTemplate = `# Proxy domain for
# port {{{port}}}
# of {{{service_id}}}
# running at IP address {{{ip_address}}}
#
server {
    listen 9011;
    listen [::]:9011;

    server_name {{{proxy_domain}}};

    location / {
        proxy_pass http://{{{ip_address}}}:{{{port}}};
        proxy_set_header Host $host;
    }
}`;

    public constructor(
        private readonly camelCaseConverter: CamelCaseConverter,
    ) {}

    map(recipeYaml: string): RecipeFormElement {
        const camelCaseYamlRecipe: any = this.camelCaseConverter.convert(
            jsYaml.safeLoad(recipeYaml),
        );

        const mappedYamlRecipe = {
            sources: [],
            assetVolumes: [],
            proxiedPorts: [],
            envVariables: [],
            composeFile: null,
            actions: [],
            summaryItems: [],
            downloadables: [],
        };

        for (const source of camelCaseYamlRecipe.sources) {
            // TODO Move Yaml validation to server side to provide checks and defaults.
            source.useDeployKey = source.useDeployKey || false;
            mappedYamlRecipe.sources.push(source);
        }

        for (const assetVolume of camelCaseYamlRecipe.assetVolumes) {
            mappedYamlRecipe.assetVolumes.push(assetVolume);
        }

        for (const proxiedPort of camelCaseYamlRecipe.proxiedPorts) {
            mappedYamlRecipe.proxiedPorts.push({
                id: proxiedPort.id,
                serviceId: proxiedPort.serviceId,
                port: `${proxiedPort.port}`,
                name: proxiedPort.name,
                useDefaultNginxConfigTemplate: !proxiedPort.nginxConfigTemplate,
                nginxConfigTemplate:
                    proxiedPort.nginxConfigTemplate ||
                    this.defaultNginxConfigTemplate,
            });
        }

        for (const envVariable of camelCaseYamlRecipe.envVariables) {
            mappedYamlRecipe.envVariables.push(envVariable);
        }

        const composeFile = camelCaseYamlRecipe.composeFiles[0];
        mappedYamlRecipe.composeFile = {
            sourceId: composeFile.sourceId,
            envDirRelativePath: composeFile.envDirRelativePath,
            composeFileRelativePaths: composeFile.composeFileRelativePaths,
        };

        for (const action of camelCaseYamlRecipe.actions) {
            mappedYamlRecipe.actions.push({
                id: action.id,
                type: action.type,
                name: action.name,
                afterBuildTasks: action.afterBuildTasks.map(afterBuildTask => {
                    const mappedAfterBuildTask = _.cloneDeep(afterBuildTask);
                    if (!mappedAfterBuildTask.id) {
                        mappedAfterBuildTask.id = '';
                    }
                    if (!mappedAfterBuildTask.dependsOn) {
                        mappedAfterBuildTask.dependsOn = [];
                    }

                    return mappedAfterBuildTask;
                }),
            });
        }

        for (const summaryItem of camelCaseYamlRecipe.summaryItems) {
            mappedYamlRecipe.summaryItems.push(summaryItem);
        }

        for (const downloadable of camelCaseYamlRecipe.downloadables) {
            mappedYamlRecipe.downloadables.push(downloadable);
        }

        return mappedYamlRecipe;
    }
}
