"use client";
import React, {useState, useEffect} from "react";
import CustomBtn from "@/app/components/CustomBtn";

const Enable2FAComponent = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/2fa/turn-on/dburain');
      const data = await response.json();
      setImageUrl(data.base64Qrcode);
    } catch (error) {
      console.error('Error retrieving image URL:', error);
    }
  };

  return (
    <div>
      <CustomBtn onClick={handleClick}>Enable 2FA</CustomBtn>
      <CustomBtn onClick={handleClick}>Disable 2FA</CustomBtn>
      {imageUrl !== '' && <img src={imageUrl} height="300" width="300" alt="QR Code" />}
    </div>
  );
};

export default Enable2FAComponent;
