import * as passport from 'passport';
import {Component} from '@nestjs/common';

@Component()
export class PassportUserSerializationConfigurationComponent {

    configure() {

        passport.serializeUser((user, done) => {
            //console.log('SERIALIZE USER', user);
            // TODO How this should be handled?

            done(null, JSON.stringify(user));
        });

        passport.deserializeUser((serializedUser, done) => {
            // TODO How this should be handled?
            const user = JSON.parse(serializedUser);
            //console.log('DESERIALIZE USER', user);

            done(null, user);
        });

    }

}