import { Body, Controller, Get, Param, Post, Query, StreamableFile, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { join } from 'path';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/support/guards/accessToken.guard';
import { ApiBearerAuth, ApiHeader, ApiOAuth2, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';


@Controller('/user')
export class UserController {
    constructor(private userService :  UserService){}

    // get all account 
    @ApiOperation({summary:"get all account in database"})
    @ApiResponse({ status: 200, description: "Ok",
            schema:{
                title: "respone data",
                type: "object",
                properties:{
                    name:{
                        type:"string",
                        example:"cao mỹ lan",
                        description: "account name"
                    },
                    email:{
                        type:"string",
                        example:"leungdaniel3@gmail.com",
                        description: "email for login"
                    },
                    password:{
                        type:"string",
                        example:"$2b$10$UEf9h3VKsKEq6zo42BcQn.LmEY8rbuoJXorCvamcvhGoI.BkvRXeu",
                        description: "password for login"
                    },
                    refresh_token:{
                        type:"String",
                        example:"$2b$10$gREJHg33SkuJuWCSZURYk.jOsAHp45MJWksjF8p.p5l6P33rPMJz6",
                        description: "encrypted refresh token"
                    }
                }
            }
     })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiTags('Account operations')
    @ApiBearerAuth('access-token')
    @UseGuards(AccessTokenGuard)
    @Get('/getAll')
    async getAllAccount()
    {
        return this.userService.getAllAccount();
    }
    
    // get account information ( use params "email")
    @ApiOperation({ summary: "get account by email"})
    @ApiResponse({ status: 200, description: "Ok",
        schema:{
            title: "respone data",
            type: "object",
            properties:{
                name:{
                    type:"string",
                    example:"cao mỹ lan",
                    description: "account name"
                },
                email:{
                    type:"string",
                    example:"leungdaniel3@gmail.com",
                    description: "email for login"
                },
                password:{
                    type:"string",
                    example:"$2b$10$UEf9h3VKsKEq6zo42BcQn.LmEY8rbuoJXorCvamcvhGoI.BkvRXeu",
                    description: "password for login"
                },
                refresh_token:{
                    type:"String",
                    example:"$2b$10$gREJHg33SkuJuWCSZURYk.jOsAHp45MJWksjF8p.p5l6P33rPMJz6",
                    description: "encrypted refresh token"
                }
            }
        }
 })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiTags('Account operations')
    @ApiBearerAuth('access-token')
    @UseGuards(AccessTokenGuard)
    @Get('/get')
    async getUser(@Query('email') email : string)
    {
        console.log(`check: ${email}`);
        const account = await this.userService.getAccountByEmail(email);
        return account;
    }

}
