import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import * as fs from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {

    //constructor(  private jwtService: JwtService ){}

    // path to database
    private path_db :string = './database/account.json';

    // get account by email
    async getAccountByEmail (email : string){
        try {
            const respone = fs.readFileSync(this.path_db,{encoding: "utf8"});
            const accountList = (JSON.parse(respone)).list_account;
            if(!(accountList instanceof Array)) throw new Error('Account list must be an array !!!');
            const account =  accountList.filter( ele => ele.email === email);
            if(account.length === 0) throw new Error('Not found !');
            return {
                name: account[0].name,
                email: account[0].email,
                password: account[0].password,
                refresh_token: account[0].refresh_token
            }
        } catch (error) {
            throw error;
        }
    }

    // get all accounts in database
    async getAllAccount()
    {
        try {
            const respone = fs.readFileSync(this.path_db,{encoding: "utf8"});
            const accountList = (JSON.parse(respone)).list_account;
            if(!(accountList instanceof Array)) throw new Error('Account list must be an array !!!');
            return accountList;
        } catch (error) {
            throw error;
        }
    }
}
