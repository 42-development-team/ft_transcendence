import React from 'react';

const OverlayMessage = ({ message } : { message: any}) => {
  return (
    <div className="fixed overlay">
      <div className="message">{message}</div>
    </div>
  );
}

export default OverlayMessage;