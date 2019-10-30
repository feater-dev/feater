import * as joi from '@hapi/joi';
import * as jsYaml from 'js-yaml';
import { ValidationResult } from '@hapi/joi';

const idRegex = /^[a-z_0-9]+$/;
const envVariableNameRegex = /[a-zA-Z_]+[a-zA-Z0-9_]*/;
const referenceTypes = ['commit', 'branch'];

export class RecipeValidator {
    private readonly supportedSchemaVersion = '0.1';

    validateRecipe(recipeAsYaml: string): ValidationResult<unknown> {
        const recipe = jsYaml.safeLoad(recipeAsYaml);

        return this.createSchema().validate(recipe, { abortEarly: false });
    }

    private createSchema(): joi.Schema {
        return joi.object().keys({
            schema_version: joi
                .string()
                .equal(this.supportedSchemaVersion)
                .required(),
            sources: joi
                .array()
                .items(this.createSourceSchema())
                .required(),
            asset_volumes: joi
                .array()
                .items(this.createAssetVolumeSchema())
                .required(),
            proxied_ports: joi
                .array()
                .items(this.createProxiedPortSchema())
                .required(),
            env_variables: joi
                .array()
                .items(this.createEnvVariableSchema())
                .required(),
            compose_files: joi.array().items(joi.object()), // TODO Improve schema.
            actions: joi.array().items(joi.object()), // TODO Improve schema.
            after_build_tasks: joi.array().items(joi.object()), // TODO Improve schema.
            downloadables: joi.array().items(joi.object()), // TODO Improve schema.
            summary_items: joi
                .array()
                .items(this.createSummaryItemSchema())
                .required(),
        });
    }

    private createSourceSchema(): joi.Schema {
        return joi.object().keys({
            id: joi
                .string()
                .regex(idRegex)
                .required(),
            clone_url: joi
                .string()
                .min(1)
                .required(),
            use_deploy_key: joi.boolean().required(),
            reference: joi.object().keys({
                type: joi
                    .string()
                    .equal(referenceTypes)
                    .required(),
                name: joi
                    .string()
                    .min(1)
                    .required(),
            }),
            before_build_tasks: joi
                .array()
                .items(
                    joi.object().keys({
                        type: joi
                            .string()
                            .equal(['copy', 'interpolate'])
                            .required(),
                    }),
                )
                .when(
                    joi
                        .object()
                        .keys({ type: 'copy' })
                        .unknown(),
                    {
                        then: joi.object().keys({
                            source_relative_path: joi
                                .string()
                                .min(1)
                                .required(),
                            destination_relative_path: joi
                                .string()
                                .min(1)
                                .required(),
                        }),
                    },
                )
                .when(
                    joi
                        .object()
                        .keys({ type: 'interpolate' })
                        .unknown(),
                    {
                        then: joi.object().keys({
                            relative_path: joi
                                .string()
                                .min(1)
                                .required(),
                        }),
                    },
                ),
        });
    }

    private createAssetVolumeSchema(): joi.Schema {
        return joi.object().keys({
            id: joi
                .string()
                .regex(idRegex)
                .required(),
            asset_id: joi.string().regex(idRegex),
        });
    }

    private createProxiedPortSchema(): joi.Schema {
        return joi.object().keys({
            id: joi
                .string()
                .regex(idRegex)
                .required(),
            service_id: joi
                .string()
                .regex(idRegex)
                .required(),
            port: joi
                .number()
                .integer()
                .min(1),
            name: joi
                .string()
                .min(1)
                .required(),
            nginx_config_template: joi.string().min(1),
        });
    }

    private createEnvVariableSchema(): joi.Schema {
        return joi.object().keys({
            name: joi
                .string()
                .regex(envVariableNameRegex)
                .required(),
            value: joi.string().required(),
        });
    }

    private createSummaryItemSchema(): joi.Schema {
        return joi.object().keys({
            name: joi
                .string()
                .min(1)
                .required(),
            value: joi
                .string()
                .min(1)
                .required(),
        });
    }
}
