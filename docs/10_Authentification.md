[Home Page](./00_Documentation.md)

## Pre-requis
	passportjs
	passport-42
	jwt

## User way
- 'Sign In' button
- redirect to intra log via passport-42 guard
- response is send to callback adress
- if response is an existing user in 42 db => create user in our db
- redirect to 2fa page and create a jwt in cookies with a boolean set to false while 2fa process isn't finish
- 2fa process finish => redirect to /home and set a new jwt cookie with boolean to true and refresh token in cookies too.