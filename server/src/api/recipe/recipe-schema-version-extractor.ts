import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipeSchemaVersionExtractor {
    extract(recipe: unknown): string {
        if (!this.hasSchemaVersion(recipe)) {
            throw new Error('Missing schema version.');
        }

        return recipe.schemaVersion;
    }

    private hasSchemaVersion(
        recipe: unknown,
    ): recipe is { schemaVersion: string } {
        return (
            (recipe as { schemaVersion: string }).schemaVersion !== undefined &&
            typeof (recipe as { schemaVersion: string }).schemaVersion ===
                'string'
        );
    }
}
