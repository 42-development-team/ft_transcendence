// FirstLoginBtn.tsx

import React from 'react';

interface FirstLoginBtnProps {
  children: React.ReactNode;
  onClick: () => Promise<void>;
  disable: boolean;
}

const ValidateBtn: React.FC<FirstLoginBtnProps> = ({ children, onClick, disable }) => {
  return (
    <button
      type="button"
      disabled={disable}
      onClick={onClick}
      className='hover:opacity-80 transition duration-300 ease-in-out bg-base text-text font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
    >
      {children}
    </button>
  );
};

export default ValidateBtn;
