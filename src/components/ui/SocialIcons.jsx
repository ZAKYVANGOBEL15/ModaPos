import React from 'react';

const InstagramButton = () => {
  return (
    <div className="group relative inline-block">
      <button>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          className="w-8 hover:scale-125 duration-200 hover:stroke-pink-500"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <circle cx="17.5" cy="6.5" r="1.5" />
        </svg>
      </button>
      <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
        Instagram
      </span>
    </div>
  );
};

const LinkedInButton = () => {
  return (
    <div className="group relative inline-block">
      <button>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          className="w-8 hover:scale-125 duration-200 hover:stroke-blue-600"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </button>
      <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
        LinkedIn
      </span>
    </div>
  );
};

export { InstagramButton, LinkedInButton };
