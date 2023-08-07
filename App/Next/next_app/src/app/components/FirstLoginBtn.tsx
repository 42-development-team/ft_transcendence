// FirstLoginBtn.tsx

import React from 'react';

interface FirstLoginBtnProps {
  children: React.ReactNode;
  onClick: () => Promise<void>;
  disable: boolean;
}

const FirstLoginBtn: React.FC<FirstLoginBtnProps> = ({ children, onClick, disable }) => {
  return (
    <button
      type="button"
      disabled={disable}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default FirstLoginBtn;
