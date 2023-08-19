"use client";
import { ChangeEvent, useState, useEffect } from 'react';
import FirstLoginBtn from '../FirstLoginBtn';
import TwoFA from '@/app/components/auth/TwoFA';
import Avatar from '../profile/Avatar';
import UpdateAvatar from './utils/updateAvatar';

const FirstLoginPageComponent = ({
    userId,
    CallbackAvatarFile = () => { },
    CallbackImageUrl = () => { },
  }
  :
  {
    userId: string,
    CallbackAvatarFile: any,
    CallbackImageUrl: any
  }) => {

    const [message, setMessage]                 = useState('');
    const [isVisible, setIsVisible]             = useState(false);
    const [validateEnabled, setValidateEnabled] = useState(true);
    const [placeHolder, setPlaceHolder]         = useState('');
    const [waiting2fa, setWaiting2fa]           = useState(true);
    const [avatarFile, setAvatarFile]           = useState<File | null>(null);
    const [imageUrl, setImageUrl]               = useState<string | null>(null);
    const [inputUserName, setInputUserName] = useState('');


    // let inputUserName: string | null;


    useEffect(() => {
 
        try {
            getUserName(userId);
        } catch (error) {
            console.log(error);
        }
    }, []);

/* called on page load, set the placeholder with default username */
    const getUserName = async (userId: string) => {
        const response = await fetch(`${process.env.BACK_URL}/auth/firstLogin/getUser/${userId}`, {
            method: "GET",
        });
        const data = await response.json();
        if (!data.ok)
            console.log(data.error);
        setPlaceHolder(data.username);
        setInputUserName(data.username);
    }

    const redirectToHome = () => {
        if (validateEnabled) {
            setMessage("Redirecting...");
            window.location.href = `${process.env.FRONT_URL}/home`;
        }
    }
      
  /* handle validate click, so username update and avagtar update in cloudinary */
  const handleClick = async () => {
    try {
      setWaiting2fa(false);
      await UpdateAvatar(avatarFile, userId, setImageUrl);
      const updateData = {
        newUsername: inputUserName,
        userId: userId,
      };
    const usernameUpdateResponse = await fetch(`${process.env.BACK_URL}/auth/firstLogin/updateUsername`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (usernameUpdateResponse.ok) {
      console.log("Username updated successfully");
    } else {
      console.log("Error updating username:", usernameUpdateResponse.status);
    }

    const jwtUpdateResponse = await fetch(`${process.env.BACK_URL}/auth/jwt`, { credentials: "include" });

    if (jwtUpdateResponse.ok) {
      console.log("JWT tokens updated successfully");
    } else {
      console.log("Error updating JWT tokens:", jwtUpdateResponse.status);
    }

    redirectToHome();
  } catch (error) {
    console.log("Error during avatar upload or username update:", error);
  }
};

      
/* handle change of username input */
    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const newinputUserName = e.target.value;
            if ( newinputUserName === "") {
                setInputUserName(placeHolder);
                setValidateEnabled(true);
                setIsVisible(false);
                return ;
            }
            else if (newinputUserName.length < 3 || newinputUserName.length > 15) {
                setMessage("Username must be at least 3 characters long, and at most 15 characters long");
                console.log("Username must be at least 3 characters long, and at most 15 characters long, newInput:", newinputUserName, "placeholder:", placeHolder);
                setValidateEnabled(false);
                setIsVisible(true);
                return ;
            }
            
            const response = await fetch(`${process.env.BACK_URL}/auth/firstLogin/doesUserNameExist/${newinputUserName}`, {
                method: "GET",
            });
            const data = await response.json();
            const isUserAlreadyTaken = data.isUsernameTaken;
            const isUsernameSameAsCurrent = newinputUserName === placeHolder;

            if (isUserAlreadyTaken && !isUsernameSameAsCurrent) {
                setValidateEnabled(false);
                setIsVisible(true);
                setMessage("Username already taken");
            }
            else {
                setIsVisible(true);
                setValidateEnabled(true);
                setMessage("Username available");
                setInputUserName(newinputUserName);
            }
        } catch (error) { 
            console.log(error);
        }

    }

    const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null) => {
        setAvatarFile(childAvatarFile);
        setImageUrl(childImageUrl);
    }

  return (
    <div className="flex flex-col items-center ">
      <div className="m-4 pt-4">
        <p className="font-bold text-center">Choose your username</p>
        <input style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}
          id="username"
          onChange={(e) => handleOnChange(e)}
          placeholder={placeHolder}
          inputMode='text'
          type="text"
          className="m-2 bg-base border-red  border-0  w-64 h-8 focus:outline-none"
        />
        {
          validateEnabled ?
            <div className=" text-green-400 text-center">
              {isVisible && <p>{message}</p>}
            </div>
            :
            <div className=" text-red-700 text-center">
              {isVisible && <p>{message}</p>}
            </div>
        }
      </div>
      <Avatar
        CallbackAvatarData={handleCallBackDataFromAvatar} imageUrlGetFromCloudinary={null} disableChooseAvatar={false} disableImageResize={true}>
      </Avatar>
      {
        waiting2fa &&
          <TwoFA userId={userId}></TwoFA>
      }
      <FirstLoginBtn onClick={handleClick} disable={!validateEnabled} >
        <div className='mt-5 font-bold text-xl'>
          Validate
        </div>
      </FirstLoginBtn>
    </div>
  )
}


export default FirstLoginPageComponent;

