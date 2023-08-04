import React from "react";

interface FirstLoginBtnProps {
  onClick: () => Promise<void>;
  disable?: boolean;
}

const FirstLoginBtn: React.FC<FirstLoginBtnProps> = ({ onClick, disable = false }) => {
  return (
    <button
      type="button"
      disabled={disable}
      style={{ opacity: disable ? 0.5 : 1 }}
      className={`font-bold text-sm rounded-lg bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3 ${
        disable ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      Validate
    </button>
  );
};

export default FirstLoginBtn;
