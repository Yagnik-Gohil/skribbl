import React, { useEffect } from "react";

const Alert = ({
  message,
  handleDisplay,
  type
}: {
  message: string;
  handleDisplay: (display: boolean) => void;
  type: 'error' | 'success';
}) => {
  // Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDisplay(false); // Close the alert after 5 seconds
    }, 5000);

    // Cleanup the timer when component unmounts or rerenders
    return () => clearTimeout(timer);
  }, [handleDisplay]);

  const handleClick = () => {
    handleDisplay(false);
  };

  return (
    <div
      role="alert"
      className={`bg-[#FFF] mt-3 relative flex p-3 text-sm border border-slate-300 rounded-lg font-regular ${type === 'error' ? 'text-theme-red' : 'text-[#22c55e]'}`}
    >
      {message}
      <button
        className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-slate-100 active:bg-slate-100 absolute top-1.5 right-1.5"
        type="button"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5 text-slate-600"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
