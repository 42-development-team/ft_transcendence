"use client";
import React, {useState, useEffect} from "react";
import { json } from "stream/consumers";
import Image from "next/image";

const Enable2FAComponent = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/2fa/turn-on/dburain');
        const data = await response.json();
        setImageUrl(data.ImageUrl);
        console.log(data);
      } catch (error) {
        console.error('Error retrieving image URL:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/2fa/turn-on/dburain');
      const data = await response.json();
      setImageUrl(data.base64Qrcode);
      console.log(data);
    } catch (error) {
      console.error('Error retrieving image URL:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Enable 2FA</button>
      {imageUrl !== '' && <img src={imageUrl} height="300" width="300" alt="QR Code" />}
    </div>
  );
};

export default Enable2FAComponent;
