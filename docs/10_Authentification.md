[Home Page](./00_Documentation.md)

## User way in our project
- 'Sign In' button
- redirect to intra log via passport-42 guard
- response is send to callback adress
- if response is an existing 42 user => user creation in our database
- redirect to 2FA page and create a `jwt` in cookies with a boolean set to false while 2fa process isn't finish
- 2FA process end => redirect to `/home` and set a new `jwt` cookie with boolean to true and set refresh token

## Tools
- [Passport.js](https://www.passportjs.org/)
- [passport-42](https://www.passportjs.org/packages/passport-42/)
- [passport-jwt](https://www.passportjs.org/packages/passport-jwt/)

---
## Oauth protocol
Open Authorization is a protocole that allow a third-party to access your database whithout sharing password.
 
### How does this works in our case?
First you need to register the project to API you want user to log with (google, facebook, 42, ...).
Specifying a callback URL that will receive the user informations (in our case: "http://'IP':'BACK_PORT'/auth/42/callback").

To trigger this Oauth protocole you need a Sign In button in the frontend. You got it ? Perfect !
Then this button will redirect to a backend URL, let say "http://'IP':'BACK_PORT'/auth/login".
BUT !
This URL is guarded by a @UseGuard(AuthGuard('42')) automatically linked with a passport-42 strategy. 
This open a page 42 in the browser to log with the user 42 account. 
The 42 API respond to the callback URL. 
The response contains:
- Access token
- Refresh token
- User profile in 42 database

Now, create the user in your database using the 42 profile informations and throw access and refresh token to the trash !
Congrats the user has been validated by 42 and is available in your database.

#### OK but why throwing the tokens?
Because the JWT contains a lot of informations about the user and you don't need to have all those informations in your frontend.

## What is JWT?
A **Json Web Token** is a base64 string in 3 parts that contains informations separated by `.`

- Header: precise the algorithm use to encrypt and the type of token
- Payload: contains the user informations
- Signature: tells if the jwt come from your website or not.

### Why would I use a JWT?
A JWT is a secure way to certify that the user trying to access your website is allowed to do so, and store information about the user.

### Create Json Web Tokens
To create a JWT you can use JwtService from '@nestjs/jwt'.
With this service you can 'sign' datas.

Let say I have a user "Marc" that have the id "1" in my database.
To sign this I need to specify :
- which informations the JWT need to contain.
- when the JWT will expire
- the secret to tell my backend that this JWT has been created by him.
	
So I will create an object : `jwtPayload = {name: "Marc", id: "1"}`
And then pass it to my jwtService to sign it like this:

```
const myJwtSigned = jwtService.sign(jwtPayload, { 
			secret: 'MySecretStringInEnvFile',
			expiresIn: '30m',
		}),
return myJwtSigned;
```

And this give a string that can be easily decoded to retrieve the user informations.

#### Why not using an old school json?

Well cause it is signed with a **secret**!

```
Using passport-jwt you can create a global guard in nestJs to verify that the JWT has been sign by your backend service.
The passport strategy attached to this guard will decode it and, before putting it in your @Request() object, verify that the secret it is encode with is the same you have in your secret environment file.
If the secret doesn't match, the guard will throw an Unauthorized exception and block the access to the user.
```

This secure your backend routes from unauthorized users who want to access your website without being authentified by you.

#### Why an access token and a refresh token?

**Security**
```
The access token will permit the user to access the website and make requests. It has a short live time.

The refresh token will allow user to get a new access token. It has a long live time.
```

This way, if someone have the access token fron another user it will not be allowed to do anything during a non limited time.
Without the refresh token he can't have a new access token.

It's important to use different secrets to sign the access and refresh tokens!!
