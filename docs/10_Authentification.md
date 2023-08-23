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

## Two Factor Authentication (2FA)
### What is 2FA ?

- Two-factor authentication is an authentication method providing an additional level of security to user accounts. This system allows for the **unique identification** of a user, **reduces unauthorized access**, and verifies that the **person** is indeed **who they claim to be**. <br>
Moreover, it decreases the possibility of a cyberattack on a weak password, for example.

### How it Works

- In general, two-factor authentication combines a password (**something the user knows**) and another element (**something the user possesses**) like a USB key, a fingerprint, or, in this case, a *One-Time Password (OTP)*.

- An **OTP** is a temporary password of short duration (or **single-use**) that can be obtained through certain applications, SMS, or email. There are numerous algorithms that generate OTPs, but many of them use **two inputs** to do so: a **seed** and a **moving factor**.

- The **seed** is a **static variable** created during the generation of a new account; it remains unchanged and is **stored as a secret key** until the account is deleted or regenerated.
On the other hand, the **moving factor** can change with **each OTP request** (***HOTP** algorithm: HMAC-based One-time Password*) or change according to a **time cycle** (***TOTP**: time-based OTP*).

### What will we use ?

- In this case, we will use **TOTP**, created from an authentication app like 'Google Authenticator' via a **QR code**.
- Indeed HOTP is more susceptible to brute-force attacks due to its longer window than TOTP, TOTP sometimes suffers from a lag between password creation and use, but is easier to implement.

### What's the process ?

User can **activate** the 2FA on his **first Loggin** and on his **'Settings'** page application. However he can only **desactivate** it on the **'Settings'** page.
1. *Generation* of a QR code (via the [*OTP library*](https://www.npmjs.com/package/otplib#hotp-options "Official OTPlib Page")) and **registration** of its secret key in the **database**.
2. *Scanning* the QR code via a third-party application (**Google authenticator** for example) to launch the OTP generation.
3. *Validation* of the QR code on our app, by the 6-digit OTP password.

**Once validated**, it becomes **impossible** to modify the secret key or access the site without entering the OTP password to confirm the operation.<br>
The OTP password is refreshed every 30 seconds.

#### <u>Logic Code on **Settings** :</u> <br>
1. **OnLoad: isTwoFAEnabled**: Check if 2FA is activated (For now, UserId is stocked in localStorage to avoid Context reset on refreshed page).
    1. *Yes*: User can only Disable it
    2. *No*: User can only Enable it
2. **Disable/Enable**
    1. Request database to verify Code
        1. Verified: 'isEnabled/disabled' changed accordingly -> Message success Display
        2. Not Verified: Error Message display -> max try limit not set for now.
3. **Button are set accordingly**

#### <u>Logic Code on **FirstLogin** : </u><br>

Almost the same as Logic Code on Settings: Steps **2** *(only enable button)* **to 3**.

###### Main 2FA files :
    - 'Auth Module' in Nest app.
    - '2FA Module' in Nest app.
    - 'FirstLogin Page' in Nest app.
    - 'Settings Page' in Nest app.
