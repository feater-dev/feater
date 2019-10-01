import * as joi from '@hapi/joi';
import * as jsYaml from 'js-yaml';

const idRegex = /^[a-z_0-9]+$/;
const envVariableNameRegex = /[a-zA-Z_]+[a-zA-Z0-9_]*/;
const referenceTypes = ['commit', 'tag', 'branch'];

export class DefintionRecipeZeroOneZeroValidator {
    validateRecipe(recipeAsYaml: string): boolean {
        const recipe = jsYaml.safeLoad(recipeAsYaml);
        const validationResult = this.createSchema().validate(recipe, {
            abortEarly: false,
        });
        // TODO Handle or return validation errors.

        return true;
    }

    protected createSchema(): joi.Schema {
        return joi.object().keys({
            schema_version: joi
                .string()
                .equal('0.1.0')
                .required(),
            sources: joi
                .array()
                .items(this.createSourceSchema())
                .required(),
            source_volumes: joi
                .array()
                .items(this.createSourceVolumeSchema())
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
            compose_files: joi.array().items(joi.object()), // TODO
            after_build_tasks: joi.array().items(joi.object()), // TODO
            summary_items: joi
                .array()
                .items(this.createSummaryItemSchema())
                .required(),
        });
    }

    protected createSourceSchema(): joi.Schema {
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

    protected createSourceVolumeSchema(): joi.Schema {
        return joi.object().keys({
            id: joi
                .string()
                .regex(idRegex)
                .required(),
            source_id: joi
                .string()
                .regex(idRegex)
                .required(),
            relative_path: joi.string(),
        });
    }

    protected createAssetVolumeSchema(): joi.Schema {
        return joi.object().keys({
            id: joi
                .string()
                .regex(idRegex)
                .required(),
            asset_id: joi.string().regex(idRegex),
        });
    }

    protected createProxiedPortSchema(): joi.Schema {
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

    protected createEnvVariableSchema(): joi.Schema {
        return joi.object().keys({
            name: joi
                .string()
                .regex(envVariableNameRegex)
                .required(),
            value: joi.string().required(),
        });
    }

    protected createSummaryItemSchema(): joi.Schema {
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
