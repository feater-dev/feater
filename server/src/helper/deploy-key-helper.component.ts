import * as path from "path";
import base32Encode = require('base32-encode');
import * as toArrayBuffer from 'to-arraybuffer';
import {Injectable} from "@nestjs/common";
import {config} from "../config/config";
import {Buffer} from "buffer";

@Injectable()
export class DeployKeyHelperComponent {

    public getIdentityFileAbsoluteGuestPath(cloneUrl: string) {
        return path.join(
            config.guestPaths.identity,
            base32Encode(
                toArrayBuffer(Buffer.from(cloneUrl, 'ascii')),
                'Crockford',
            ),
        );
    }

}
