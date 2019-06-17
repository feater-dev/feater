import {Module} from '@nestjs/common';
import {DeployKeyHelperComponent} from './deploy-key-helper.component';

@Module({
    providers: [
        DeployKeyHelperComponent,
    ],
    exports: [
        DeployKeyHelperComponent,
    ],
})
export class HelperModule {}
