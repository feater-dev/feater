import { DefinitionRecipeFormElement } from '../recipe-form/definition-recipe-form.model';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';
import { Injectable } from '@angular/core';

@Injectable()
export class DefinitionRecipeYamlMapperService {
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

    map(recipeYaml: string): DefinitionRecipeFormElement {
        const camelCaseYamlRecipe: any = camelCaseKeys(
            jsYaml.safeLoad(recipeYaml),
            { deep: true },
        );

        const mappedYamlRecipe = {
            sources: [],
            sourceVolumes: [],
            assetVolumes: [],
            proxiedPorts: [],
            envVariables: [],
            composeFile: null,
            afterBuildTasks: [],
            summaryItems: [],
        };

        for (const source of camelCaseYamlRecipe.sources) {
            // TODO Move Yaml validation to server side to provide checks and defaults.
            source.useDeployKey = source.useDeployKey || false;
            mappedYamlRecipe.sources.push(source);
        }

        for (const sourceVolume of camelCaseYamlRecipe.sourceVolumes) {
            mappedYamlRecipe.sourceVolumes.push(sourceVolume);
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

        mappedYamlRecipe.composeFile = {
            sourceId: camelCaseYamlRecipe.composeFiles[0].sourceId,
            envDirRelativePath:
                camelCaseYamlRecipe.composeFiles[0].envDirRelativePath,
            composeFileRelativePaths:
                camelCaseYamlRecipe.composeFiles[0].composeFileRelativePaths,
        };

        for (const afterBuildTask of camelCaseYamlRecipe.afterBuildTasks) {
            const mappedAfterBuildTask = afterBuildTask;

            if (!afterBuildTask.id) {
                mappedAfterBuildTask.id = '';
            }

            if (!afterBuildTask.dependsOn) {
                mappedAfterBuildTask.dependsOn = [];
            }

            mappedYamlRecipe.afterBuildTasks.push(mappedAfterBuildTask);
        }

        for (const summaryItem of camelCaseYamlRecipe.summaryItems) {
            mappedYamlRecipe.summaryItems.push(summaryItem);
        }

        return mappedYamlRecipe;
    }
}
