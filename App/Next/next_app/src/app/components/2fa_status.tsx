"use client";
import React, {useState, useEffect} from "react";
import CustomEnableTwoFABtn from "@/app/components/CustomEnableTwoFaButton";
import CustomDisableTwoFABtn from "./CustomDisableTwoFAButton";

const TwoFAEButton = document.getElementById("TwoFAEButton") as HTMLButtonElement;
const TwoFADButton = document.getElementById("TwoFADButton") as HTMLButtonElement;

const disableButton = (id: string) => {
  if (id === "TwoFAEButton"){
      TwoFAEButton.disabled = true;
      TwoFAEButton.style.opacity = "0.5";
  }
  else {
    TwoFADButton.disabled = true;
    TwoFADButton.style.opacity = "0.5";
  }
}

const enableButton = (id: string) => {
  if (id === "TwoFAEButton"){
    TwoFAEButton.disabled = false;
    TwoFAEButton.style.opacity = "1";
  }
  else {
    TwoFADButton.disabled = false;
    TwoFADButton.style.opacity = "1";
  }
}

const Enable2FAComponent = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleEnableClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/2fa/turn-on/dburain');
      const data = await response.json();
      setImageUrl(data.base64Qrcode);
      disableButton("TwoFAEButton");
      enableButton("TwoFADButton");
    } catch (error) {
      console.error('Error retrieving image URL:', error);
    }
  };

  const handleDisableClick = async () => {
    enableButton("TwoFAEButton");
    disableButton("TwoFADButton");
  }
  return (
    <div>
      <CustomEnableTwoFABtn onClick={handleEnableClick}>Enable 2FA</CustomEnableTwoFABtn>
      <CustomDisableTwoFABtn onClick={handleDisableClick}>Disable 2FA</CustomDisableTwoFABtn>
      {imageUrl !== '' && <img src={imageUrl} height="300" width="300" alt="QR Code" />}
    </div>
  );
};

export default Enable2FAComponent;
