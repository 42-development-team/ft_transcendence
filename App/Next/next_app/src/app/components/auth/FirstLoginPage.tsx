"use client";
import { GetServerSidePropsContext } from 'next';
import { ChangeEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import FirstLoginBtn from '../FirstLoginBtn';
import TwoFA from '@/app/components/auth/TwoFA';
interface FirstLoginPageProps {
  userId: string;
}



const FirstLoginPageComponent = ({userId}: {userId: string}) => {
    
    const [message, setMessage]                 = useState('');
    const [isVisible, setIsVisible]             = useState(false);
    const [validateEnabled, setValidateEnabled] = useState(true);
    const [placeHolder, setPlaceHolder]         = useState('');
    const [waiting2fa, setWaiting2fa]           = useState(true);
    const [avatarFile, setAvatarFile]           = useState<File | null>(null);
    const [imageUrl, setImageUrl]               = useState<string | null>(null);

    let inputUserName: string;


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
        setPlaceHolder(data.username);
        inputUserName = data.username;
    }

    const redirectToHome = () => {
        if (validateEnabled) {
            setMessage("Redirecting...");
            window.location.href = `${process.env.FRONT_URL}/home`;
        }
    }

    /* When the user selects an image for the avatar, 
    the handleAvatarChange function is called */
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
      
        if (!file) {
          // If no file is selected, reset the state for avatarFile and imageUrl
          setAvatarFile(null);
          setImageUrl(null);
          return;
        }
      
        if (!file.type.startsWith('image/')) {
          console.log('Selected file is not an image.');
          return;
        }
      
        const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSizeInBytes) {
          console.log('Selected file size exceeds the allowed limit.');
          return;
        }
      
        setAvatarFile(file);
        setImageUrl(URL.createObjectURL(file));
      };
      
      
    /*
    after the avatar image is uploaded to the back-end and 
    the imageUrl is sent with the response, 
    we update the state with the Cloudinary URL
    */
   const handleClick = async () => {
  try {
    setWaiting2fa(false);
    let avatarUrl = null;
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append("userID", userId);

      const response = await fetch(`${process.env.BACK_URL}/avatars/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.log("Error response status:", response.status);
        console.log("Error response text:", await response.text());
      } else {
        const data = await response.json();
        avatarUrl = data.imageUrl;
        console.log("Avatar URL from Cloudinary:", avatarUrl);
        setImageUrl(avatarUrl);
      }
    }

    const inputUserName = (document.getElementById('username') as HTMLInputElement)?.value;

    if (!inputUserName || inputUserName.length < 3 || inputUserName.length > 15) {
      setMessage("Username must be at least 3 characters long, and at most 15 characters long");
      setValidateEnabled(false);
      setIsVisible(true);
      return;
    }
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
            inputUserName = e.target.value;
            if (e.target.value === "") {
                setValidateEnabled(true);
                inputUserName = placeHolder;
                setIsVisible(false);
                return ;
            }
            else if (inputUserName.length < 3 || inputUserName.length > 15) {
                setMessage("Username must be at least 3 characters long, and at most 15 characters long");
                setValidateEnabled(false);
                setIsVisible(true);
                return ;
            }
            
            const response = await fetch(`${process.env.BACK_URL}/auth/firstLogin/doesUserNameExist/${inputUserName}`, {
                method: "GET",
            });
            const data = await response.json();
            const isUserAlreadyTaken = data.isUsernameTaken;
            const isUsernameSameAsCurrent = inputUserName === placeHolder;

            if (isUserAlreadyTaken && !isUsernameSameAsCurrent) {
                setValidateEnabled(false);
                setIsVisible(true);
                setMessage("Username already taken");
            }
            else {
                setIsVisible(true);
                setValidateEnabled(true);
                setMessage("Username available");
            }
        } catch (error) { 
            console.log(error);
        }

    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="m-4 pt-4">
                <p className="font-bold text-center">Choose your username</p>
                <input style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold"}}
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

            <div className="m-4 pt-4">
                <p className="font-bold text-center"></p>
                {imageUrl ? (
                <div>
                    {/* Display uploaded avatar image temporary stored in URL*/}
                    <Image
                    src={imageUrl}
                    alt="Selected Avatar"
                    width={128}
                    height={128}
                    className="drop-shadow-xl"
                    />
                </div>
                ) : (
                <div>
                    {/* Display default avatar */}
                    <Image
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    alt="Default Avatar"
                    width={128}
                    height={128}
                    className="drop-shadow-xl"
                    />
                </div>
                )}
                <div className="mt-2" style={{ marginTop: "20px" }}>
                    <label htmlFor="avatarInput" className="cursor-pointer" style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold"}}>
                    {imageUrl ? "Change Avatar" : "Choose Avatar"}
                    </label>
                    <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    />
                </div>
            </div>

            {
                waiting2fa &&
                <div className="flex flex-col flex-auto items-center justify-center">
                    <TwoFA userId={userId}></TwoFA>
                </div>
            }
            <FirstLoginBtn onClick={handleClick} disable={!validateEnabled}>
              Validate
            </FirstLoginBtn>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { userId } = context.query;

  if (!userId || typeof userId !== 'string') {
    return {
      redirect: {
        destination: '/error-page', // TBC
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId,
    },
  };
}


export default FirstLoginPageComponent;

