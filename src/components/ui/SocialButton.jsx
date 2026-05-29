import React from 'react';

const SocialButton = ({ icon: Icon, label, url, strokeColor = "currentColor" }) => {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative inline-block"
    >
      <button className="p-2">
        <Icon strokeColor={strokeColor} className="w-8 h-8 hover:scale-125 duration-200 group-hover:stroke-blue-500" />
      </button>
      <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
        {label}
      </span>
    </a>
  );
};

export default SocialButton;
