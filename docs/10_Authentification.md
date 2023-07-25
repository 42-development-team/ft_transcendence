[Home Page](./00_Documentation.md)

## User way in our project
- 'Sign In' button
- redirect to intra log via passport-42 guard
- response is send to callback adress
- if response is an existing user in 42 database => create user in our database
- redirect to 2fa page and create a jwt in cookies with a boolean set to false while 2fa process isn't finish
- 2fa process finish => redirect to /home and set a new jwt cookie with boolean to true and refresh token in cookies too.

# Tools
	passportjs
	passport-42
	passport-jwt
---
##	What is Oauth protocole ?
	Open Authorization is a protocole that allow a third-party to access your database whithout sharing password.
###	How does this works in our case ?
	First you need to declare a project at the API you want user to log with (google, facebook, 42, ...).
	When declaring this project you specify a callback URL that will receive the user informations (in our case: "http://'IP':'BACK_PORT'/auth/42/callback").

	To trigger this Oauth protocole you need a Sign In button in the frontend. You got it ? Perfect !
	Then this button will redirect to a backend URL, let say "http://'IP':'BACK_PORT'/auth/login".
	BUT !
	This URL is guarded by a @UseGuard(AuthGuard('42')) automatically linked with a passport-42 strategy. This open a page 42 in the browser to log with the user 42 account. User enter his 42 login and password, then 42 api send the response to the callback URL. The response contain:
		- an access token
		- a refresh token
		- the user profile in 42 database

	Now, create the user in your database using the 42 profile informations and throw access and refresh token to the trash !
	Congrats the user has been validated by 42 and is available in your database.

#### OK but why throwing the tokens ??
	Because it is a JWT that contains a lot of user informations and you don't need to have all those informations in your frontend.
---
##	What is JWT ?
	A Json Web Token is a base64 string in 3 parts that contains informations separated by '.'

	First part is the header. It precise the algorithm use to encrypt and the type of token.
	Second part is the payload. It contains the user informations.
	Third part is the signature that tells if the jwt come from your website or not.

### Why would I use a JWT ?
	A JWT is a secure way to certify that the user trying to access your website is allowed to do it and to give informations to the frontend about what he will need to display on screen.
	Let's explain how you create them first.

### Create Json Web Tokens
	To create a JWT you can use JwtService from '@nestjs/jwt'.
	With this service you can 'sign' datas.

	Let say I have a user "Marc" that have the id "1" in my database.
	To sign this I need to specify :
		- which informations the JWT need to contain.
		- when the JWT will expire
		- the secret to tell my backend that this JWT has been created by him.
	
	So I will create an object :
		jwtPayload = {name: "Marc", id: "1"}
	and pass it to my jwtService to sign it like this:
```
const myJwtSigned = 
		jwtService.sign(jwtPayload, { 
			secret: 'MySecretStringInEnvFile',
			expiresIn: '30m',
		}),
	
	return myJwtSigned;
```
	And this give me a weird string I can easily decode in frontend and backend to get the user informations I need to work with.

#### Ok cool but why not just giving informations to the frontend in an old school json?

	Well cause it is sign with a secret!
	---
	Using passport-jwt you can create a global guard in nestJs to verify that the JWT has been sign by your backend service.
	The passport strategy attached to this guard will decode it and, before putting it in your @Request() object, verify that the secret it is encode with is the same you have in your secret environment file.
	If the secret doesn't match, the guard will throw an Unauthorized exception and block the access to the user.
	---
	This secure your backend routes from unauthorized users who want to access your website without being authentified by you.

#### Last question, why the Oauth with 42 sends you an access token and a refresh one ??

	Deeply observed.. Well the answer is again : Security.
	---
	The access token is the one that will permit the user to access your website and make requests. It has a short live time.

	The refresh token is the one that will allow your user to get a new access token. It has a long live time.
---
	This way, if someone have the access token of another user it will not permit him to do anything during a non limited time and without the refresh token he can't have a new access token to continue doing weird things with the user account.

	Be carefull using 2 differents secret to sign your access and refresh tokens !! (Security)
