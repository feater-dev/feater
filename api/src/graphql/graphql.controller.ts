import {Controller, Post, Request, Response, Next} from '@nestjs/common';
import {graphqlExpress} from 'apollo-server-express';
import {GraphqlSchemaFactory} from './schema/graphql-schema-factory.component';

@Controller()
export class GraphqlController {
    constructor(
        private readonly graphqlService: GraphqlSchemaFactory,
    ) { }

    @Post('api')
    public async create(@Request() req, @Response() res, @Next() next) {
        return graphqlExpress({schema: this.graphqlService.createSchema()})(req, res, next);
    }
}
