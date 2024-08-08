## Develop backend for a hotel booking application using NestJS ( DEMO version 1.0.0 )

#Technology use: jwt, passport, swagger, axios, bcrypt, class-transformer, class-validator, dotenv, form-data, js-md5, passport-google-oauth20, passport-jwt, xml2js

#Token operations: 

        🧑🏻‍💼When the user logs into the application, then we create two token ( access & refresh ) and save it into HttpOnly cookie, otherwise we encrypt the refresh-token and save it into database ( mysql, postgresql, mongodb,... ).
        🧑🏻‍💼When the user accesses into some api route which is protected by jwt, then they need to provide the access token to get access.
        🧑🏻‍💼In case the access token has expried ( Tokens usually have a short life ), we use old access token (which has expried) + current refresh token is stored in HttpOnly cookie + refresh token is store in database ( encrypted token ) 
            1. check if current access token is valid ( with option: ignoreExpiration = true ).
            2. check if current refresh token is valid ( with option: ignoreExpiration = false ).
            3. get refresh token stored in database => check hash with current refresh token.
            4. if any of the previous steps are wrong, return an error, otherwise generate a new access token.

#API Endpoint: all  api endpoints are noted in the swagger UI => URL: http://localhost:3000/api#/

#Folder description:
    
        ⚫️src/user: contains account information ( get all accounts, get accounts by email )
        ⚫️src/token: contains account operations with jwt token ( register account, login, logout, refresh jwt token )
        ⚫️src/support/file-format/xml: contains xml to json conversion function.
        ⚫️src/payment: contains payment operations ( create order, check order, get bank list )
        ⚫️src/google: google login
        ⚫️database: JSON database

