import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    // path to database
    private path_db :string = './database/account.json';

    // register account

    async registerAccount(name : string, email: string, password: string) : Promise<any>{

        // check exists account
        const isExists = await this.checkExistsAccount(email);
        if(isExists) throw new NotAcceptableException('Account already exists !!!');
        // encrypt password
        const passwordEncrypted = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        // register account infor
        const payload = {
            name: name,
            email: email
        }
        const token = await this.genToken(payload);
        const account = {
            name: name,
            email: email,
            password: passwordEncrypted,
            refresh_token: bcrypt.hashSync(token.refresh_token, bcrypt.genSaltSync(10))
        }
        // get current list account in file "account/json"
        const respone = fs.readFileSync(this.path_db,{encoding: "utf8"});
        const accountList = (JSON.parse(respone)).list_account;
        if(!(accountList instanceof Array)) throw new NotAcceptableException('Account list must be an array !!!');
        accountList.push(account);
        fs.writeFileSync(this.path_db, JSON.stringify({
            list_account: accountList
        }));
        return {
            status: "ok",
            description: "Account successfully created.",
        };
    }

    // account login

    async loginAccount( email: string, password: string ): Promise <any>
    {

        const account = await this.userService.getAccountByEmail(email);
        if(!(account.email)) throw new NotAcceptableException('Account not found !!!')
        // current password
        const passwordEncrypted = account.password;
        // input password
        const passwordInput = password;
        // valid password
        const validPassword = bcrypt.compareSync(passwordInput, passwordEncrypted);
        if(!validPassword) throw new NotAcceptableException('incorrect password !!!')
        // return account information
        const payload = {
            accountName: account.name,
            email: account.email,
            access_token: (await this.genToken({name: account.name, email: account.email})).access_token,
            refresh_token: (await this.genToken({name: account.name, email: account.email})).refresh_token,
        }
        // encrypt the refresh token and store it in the database
        this.encryptRefreshToken(payload.email, payload.refresh_token);
        return payload;
    }

    // account logout

    async logOut(email: string)
    {
        const isExists = await this.checkExistsAccount(email);
        if (!isExists) throw new NotFoundException('Account not found !!!');

        const respone = fs.readFileSync(this.path_db,{encoding: "utf8"});
        const accountList = (JSON.parse(respone)).list_account;
        if(!(accountList instanceof Array)) throw new NotAcceptableException('Account list must be an array !!!'); 
        let accountListUpdate = accountList.map( function(ele) {
            if(ele.email === email)
            {
                ele.refresh_token = null;
            }
            return ele;
        });

        fs.writeFileSync(this.path_db, JSON.stringify({
            list_account: accountListUpdate
        }));
        return {
            status: "ok",
            description: "logout successful.",
        }       
    }

    // refresh access token when it expires

    async refreshTokens(email: string, refresh_token: string, access_token_old: string) 
    {

        const isExists = await this.checkExistsAccount(email);
        if (!isExists || !refresh_token) throw new ForbiddenException('Access Denied');
        const getAccountFromDB = await this.userService.getAccountByEmail(email);
        // check valid old access token
        const checkOldAccess = await this.jwtService.verifyAsync(access_token_old, {
                ignoreExpiration: true,
                secret: process.env.ACCESS_TOKEN
        });
        // check valid current refresh token (cookie)
        const checkRefreshtoken = this.jwtService.verifyAsync(refresh_token, {secret: process.env.REFRESH_TOKEN});
        // check valid refresh token (in DB)
        const checkRefreshtokenDB = bcrypt.compareSync(refresh_token,  getAccountFromDB.refresh_token);
    
        if(!checkOldAccess || !checkRefreshtoken || !checkRefreshtokenDB) throw new ForbiddenException('Access Denied');
        const newAccessToken = (await this.genToken({name: getAccountFromDB.name, email: getAccountFromDB.email})).access_token;
        return {
                access_token: newAccessToken
            }
    }

    // encrypt fresh token

    async encryptRefreshToken(email : string, refresh_token : string)
    {
        const refresh_token_encrypt = bcrypt.hashSync(refresh_token, bcrypt.genSaltSync(10));
        // get current list account in file "account/json"
        const respone = fs.readFileSync(this.path_db,{encoding: "utf8"});
        const accountList = (JSON.parse(respone)).list_account;
        if(!(accountList instanceof Array)) throw new NotAcceptableException('Account list must be an array !!!'); 
        let accountListUpdate = accountList.map( function(ele) {
            if(ele.email === email)
            {
                ele.refresh_token = refresh_token_encrypt
            }
            return ele;
        });

        fs.writeFileSync(this.path_db, JSON.stringify({
            list_account: accountListUpdate
        }));
    }

    // check exists account

    async checkExistsAccount(email : string)
    {
        const respone = fs.readFileSync(this.path_db,{encoding: "utf8"});
        const accountList = (JSON.parse(respone)).list_account;
        if(!(accountList instanceof Array)) throw new NotAcceptableException('Account list must be an array !!!');
        return (accountList.filter(ele => ele.email === email).length === 1) ? true : false;
    }

    // create access and refresh token
    async genToken(payload : any){

        const [access_token , refresh_token] = await Promise.all(
            [
                this.jwtService.signAsync(
                    payload,
                    {
                        secret: process.env.ACCESS_TOKEN,
                        expiresIn: '15m',
                    }
                ),
                this.jwtService.signAsync(
                    payload,
                    {
                        secret: process.env.REFRESH_TOKEN,
                        expiresIn: '10d',
                    }
                ),
            ]
        );
        return { access_token, refresh_token};
    }
}
