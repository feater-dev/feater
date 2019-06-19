import {DefinitionConfigFormElement} from '../config-form/definition-config-form.model';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';
import {Injectable} from '@angular/core';


@Injectable()
export class DefinitionConfigYamlMapperService {

    map(configYaml: string): DefinitionConfigFormElement {
        const camelCaseYamlConfig: any = camelCaseKeys(jsYaml.safeLoad(configYaml), {deep: true});

        const mappedYamlConfig = {
            sources: [],
            sourceVolumes: [],
            assetVolumes: [],
            proxiedPorts: [],
            envVariables: [],
            composeFile: null,
            afterBuildTasks: [],
            summaryItems: [],
        };

        for (const source of camelCaseYamlConfig.sources) {
            // TODO Move Yaml validation to server side to provide checks and defaults.
            source.useDeployKey = source.useDeployKey || false;
            mappedYamlConfig.sources.push(source);
        }

        for (const sourceVolume of camelCaseYamlConfig.sourceVolumes) {
            mappedYamlConfig.sourceVolumes.push(sourceVolume);
        }

        for (const assetVolume of camelCaseYamlConfig.assetVolumes) {
            mappedYamlConfig.assetVolumes.push(assetVolume);
        }

        for (const proxiedPort of camelCaseYamlConfig.proxiedPorts) {
            mappedYamlConfig.proxiedPorts.push({
                id: proxiedPort.id,
                serviceId: proxiedPort.serviceId,
                port: `${proxiedPort.port}`,
                name: proxiedPort.name,
            });
        }

        for (const envVariable of camelCaseYamlConfig.envVariables) {
            mappedYamlConfig.envVariables.push(envVariable);
        }

        mappedYamlConfig.composeFile = {
            sourceId: camelCaseYamlConfig.composeFiles[0].sourceId,
            envDirRelativePath: camelCaseYamlConfig.composeFiles[0].envDirRelativePath,
            composeFileRelativePaths: camelCaseYamlConfig.composeFiles[0].composeFileRelativePaths,
        };

        for (const afterBuildTask of camelCaseYamlConfig.afterBuildTasks) {
            const mappedAfterBuildTask = afterBuildTask;

            if (!afterBuildTask.id) {
                mappedAfterBuildTask.id = '';
            }

            if (!afterBuildTask.dependsOn) {
                mappedAfterBuildTask.dependsOn = [];
            }

            mappedYamlConfig.afterBuildTasks.push(mappedAfterBuildTask);
        }

        for (const summaryItem of camelCaseYamlConfig.summaryItems) {
            mappedYamlConfig.summaryItems.push(summaryItem);
        }

        return mappedYamlConfig;
    }
}
