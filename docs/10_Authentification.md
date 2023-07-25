[Home Page](./00_Documentation.md)

# Tools
	passportjs
	passport-42
	passport-jwt

# Prerequis
##	What is Oauth protocole ?
	Open Authorization is a protocole that allow a third-party to access your database whithout sharing password.
###	How does this works in our case ?
	First we need to declare a project at the API we want our user to log with (google, facebook, 42, ...).
	When declaring this project we specify a callback URL that will receive the user informations (in our case: "http://'IP':'BACK_PORT'/auth/42/callback").

	To trigger this Oauth protocole we need a SignIn button in the frontend.
	Then this button will redirect to a backend URL, let say "http://'IP':'BACK_PORT'/auth/login".
	BUT ! this URL is guarded by a @UseGuard() linked with a passport-42 strategy. This open a page 42 in the browser to log with 42 account. Then 42 api send the response to our callback URL. The response contain:
		- an access token
		- a refresh token
		- the user profile in 42 database

##	What is JWT ?

## User way
- 'Sign In' button
- redirect to intra log via passport-42 guard
- response is send to callback adress
- if response is an existing user in 42 db => create user in our db
- redirect to 2fa page and create a jwt in cookies with a boolean set to false while 2fa process isn't finish
- 2fa process finish => redirect to /home and set a new jwt cookie with boolean to true and refresh token in cookies too.