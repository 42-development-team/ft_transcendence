// "use client";
// import CustomBtn from "@/components/CustomBtn";



// const LoginComponent = () => {
// 	return (
// 		<div>
// 			<CustomBtn id='' disable={false} onClick={SignIn} >
// 				Sign With 42
// 			</CustomBtn>
// 		</div>
// 	)
// }

// export default LoginComponent;

import { useEffect, useState } from "react";
import CustomBtn from "@/components/CustomBtn";

function SignIn() {
  const [jwt, setJwt] = useState<string | null>(null);
  const childWindow = window.open("http://127.0.0.1:4000/auth/logIn");

  const receiveMessage = (event: MessageEvent) => {
    // Check if the message is coming from the child window
    if (event.source === childWindow) {
      // Extract the JWT from the message
      const jwt = event.data as string;

      // You can now use the JWT as desired
      setJwt(jwt);

      // Close the child window if needed
	  if (childWindow)
      	childWindow.close();

      // Remove the event listener
      window.removeEventListener("message", receiveMessage);
    }
  };

  useEffect(() => {
    // Listen for messages from the child window
    window.addEventListener("message", receiveMessage);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return (
    <div>
      {jwt ? (
        <p>JWT: {jwt}</p>
      ) : (
        <CustomBtn id="" disable={false} onClick={SignIn}>
          Sign With 42
        </CustomBtn>
      )}
    </div>
  );
}

export default SignIn;
