import { Controller, HttpCode, HttpStatus, Post,Body, UseGuards, Get, Query, Res, Request, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/support/guards/accessToken.guard';


@Controller('auth')
export class AuthController {
    constructor(private auService : AuthService){}

    @ApiOperation({summary:"register account"})
    @ApiBody({
        schema:{
            type:"object",
            required:["name", "email", "password"],
            properties:{
                name:{
                    type:"string",
                    example: "daniel",
                    description: "account name"
                },
                email:{
                    type:"string",
                    example: "leungdaniel25@gmail.com",
                    description: "email for login"
                },
                password:{
                    type:"string",
                    example: "password@12346",
                    description: "password for login"
                }
            }
        }
    })
    @ApiResponse({ status: 200, description:"Ok", schema:{
            type:"object",
            properties:{
                status: {type:"string", example:"Ok"},
                description: {type:"string", example:"Account successfully created."},
            }
    }})
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiTags('Account operations')
    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() user : UserDTO)
    {
        const respone = await this.auService.registerAccount(user.name, user.email, user.password);
        return respone;
    }

    @HttpCode(HttpStatus.OK)
    @ApiTags('Account operations')
    @ApiOperation({summary:"login account"})
    @ApiBody({
        schema:{
            type:"object",
            properties:{
                email:{
                    type:"string",
                    example: "leungdaniel25@gmail.com",
                    description: "email for login"
                },
                password:{
                    type:"string",
                    example: "password@1234",
                    description: "password for login"
                }
            }
        }
    })
    @ApiResponse({ status: 200, description: "Ok",
        schema:{
            type:"object",
            properties:{
                accountName:{
                    type:"string",
                    example:"nguyên gia tấn"
                },
                email:{
                    type:"string",
                    example:"consaorong@gmail.com"
                },
                access_token:{
                    type:"string",
                    example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmd1ecOqbiBnaWEgdOG6pW4iLCJlbWFpbCI6ImNvbnNhb3JvbmdAZ21haWwuY29tIiwiaWF0IjoxNzIzMDg1NTg2LCJleHAiOjE3MjMwODY0ODZ9.EraN6tipIVmevuT9454zY-WMIH06yNuZU1kqgdUKIh8"
                },
                refresh_token:{
                    type:"string",
                    example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmd1ecOqbiBnaWEgdOG6pW4iLCJlbWFpbCI6ImNvbnNhb3JvbmdAZ21haWwuY29tIiwiaWF0IjoxNzIzMDg1NTg2LCJleHAiOjE3MjM5NDk1ODZ9.J-46KTziJem9LwtiaxxEtn1O1y5SgAlnymeXPWNGLGg"
                }
            }
        }
    })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @Post('login')
    async login(
        @Body() user: UserDTO,
        @Res({ passthrough: true }) response: Response
    )
    {
        const data = await this.auService.loginAccount(user.email, user.password);
        // send access and refresh token in cookie to client
        response.cookie('jwt-acc', data.access_token, { httpOnly: true, domain: process.env.FRONTEND_DOMAIN});
        response.cookie('jwt-ref', data.refresh_token, { httpOnly: true, domain: process.env.FRONTEND_DOMAIN});
        return data;
    }

    @HttpCode(HttpStatus.OK)
    @ApiTags('Account operations')
    @ApiOperation({summary:"logout account"})
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiResponse({ status: 200, description: "Ok" })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @Post('logout')
    async logout(@Query('email') email : string)
    {
        const respone = await this.auService.logOut(email);
        return respone;
    }

    //refresh token
    
    @ApiTags('Account operations')
    @ApiOperation({summary:"refresh token"})
    @Post('refresh')
    @ApiResponse({ status: 201, description: "Ok", 
        schema:{
            type:"object",
            properties:{
                access_token:{ type:"string", example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmd1ecOqbiBnaWEgdOG6pW4iLCJlbWFpbCI6ImNvbnNhb3JvbmdAZ21haWwuY29tIiwiaWF0IjoxNzIzMTEwNzEzLCJleHAiOjE3MjM5NzQ3MTN9.RFKz182sgO3M2PeOL4TrI9zhh2ZBFZQfMwDehSgIz4c",
                    description:"new access token"
                 }
            }
        }
    })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiBody({
        schema:{
            type:"object",
            properties:{
                email:{
                    type:"string",
                    example: "leungdaniel25@gmail.com",
                    description: "email for login"
                },
                refresh_token:{
                    type:"string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmd1ecOqbiBnaWEgdOG6pW4iLCJlbWFpbCI6ImNvbnNhb3JvbmdAZ21haWwuY29tIiwiaWF0IjoxNzIzMTEwNzEzLCJleHAiOjE3MjM5NzQ3MTN9.RFKz182sgO3M2PeOL4TrI9zhh2ZBFZQfMwDehSgIz4c",
                    description: "refresh token stored in http-cookie"
                },
                access_token_old:{
                    type:"string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmd1ecOqbiBnaWEgdOG6pW4iLCJlbWFpbCI6ImNvbnNhb3JvbmdAZ21haWwuY29tIiwiaWF0IjoxNzIzMTEwNzEzLCJleHAiOjE3MjMxMTE2MTN9.eAAqnaWHAVjLoawaku2hqDLIJG0nlithAe67h5TEL38",
                    description: "access token stored in http-cookie ( expired )"
                }
            }
        }
    })
    async refreshToken(@Body() payload)
    {
        const respone = await this.auService.refreshTokens(payload.email, payload.refresh_token, payload.access_token_old);
        return respone;
    }

    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //   return req.account;
    // }
}
