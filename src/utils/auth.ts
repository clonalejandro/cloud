/** IMPORTS **/

import bCrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../orms/user';


export default class Auth {


    /** SMALL CONSTRUCTORS **/

    private App: any;
    private passport: any;
    private prefix: string;

    constructor(App: any, passport: any){
        this.App = App;
        this.passport = passport;
        this.prefix = "AUTH";

        this.configureLogin();
        this.configureRegister();
    }


    /** REST **/

    /**
     * This function configure the login strategy
     */
    private configureLogin(): void {
        const contextPrefix = "LOGIN";
        const prefix = `${this.prefix}-${contextPrefix}`;

        const localStrategy = new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req: any, username: any, password: any, done: any) => 
            User.findOne({username: username}, (err: any, user: any) => {
                if (err){
                    this.App.throwErr(err, prefix);
                    return done(err)
                }

                if (!user) return done(null, false, req.flash('msg', 'User Not found!'))
                if (!this.isValidPassword(user, password)) return done(null, false, req.flash('msg', 'Oops! Wrong password.'))
                
                return done(null, user)
            }
        ));

        this.passport.use('login', localStrategy)
    }


    /**
     * This function configure the register strategy
     */
    private configureRegister(): void {
        const contextPrefix = "REGISTER";
        const prefix = `${this.prefix}-${contextPrefix}`;

        const localStrategy = new LocalStrategy({
            passReqToCallback: true
        },
        (req: any, username: any, password: any, done: any) => {
            const findOrCreate = () => User.findOne({username: username}, (err: any, user: any) => {
                if (err){
                    this.App.throwErr(err, prefix);
                    return done(err)
                }

                if (user) return done(null, false, req.flash('msg', 'That username is already taken.'))

                const schema = new User({
                    email: req.body.email,
                    username: username,
                    password: this.createHash(password),
                    rankId: 0
                });

                schema.save((err: any) => {
                    if (err) this.App.throwErr(err, prefix)
                    else {
                        this.App.Api.ApiFile.createUserFolder(username);
                        return done(null, schema)
                    }
                })
            });

            process.nextTick(findOrCreate)
        });

        this.passport.use('signup', localStrategy)
    }


    /**
     * This function encrypt the password passed by parameter
     * @param {String} password 
     * @return {String} passwordHashed
     */
    createHash(password: string): string {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10))
    }


    /**
     * This function check if user has a valid password
     * @param user 
     * @param password 
     * @return {Boolean}
     */
    private isValidPassword(user: any, password: any): boolean {
        return bCrypt.compareSync(password, user.password)
    }
}