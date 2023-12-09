import { type, validateDefinition, PrecompiledDefaults, inferDefinition } from "arktype"
import { asOut } from "arktype/internal/scopes/type.js"


/**
 * ConfigError
 */
export class MissingConfigError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ConfigError"
    }
}

export class ConfigValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ConfigValidationError"
    }
}

export async function getConfig<T>(params: { domain?: string, schema: validateDefinition<T, PrecompiledDefaults> }): Promise<asOut<inferDefinition<T, PrecompiledDefaults>>> {
    const domain = params.domain ?? "App";
    const { default: nodeConfig } = await import("config");


    const config_type = type(params.schema);


    if (!nodeConfig.has(domain)) {
        throw new MissingConfigError(`Config "${domain}" not found`)
    }

    const config = nodeConfig.util.toObject(nodeConfig.get(params.domain ?? "App"))

    const { data: validated_config, problems } = config_type(config);

    if (problems) {
        throw new ConfigValidationError(problems.toString())
    }

    return validated_config
}
