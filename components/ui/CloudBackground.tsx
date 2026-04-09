import React from 'react';
import Image from 'next/image';

interface CloudBackgroundProps {
  children?: React.ReactNode;
}

export const CloudBackground: React.FC<CloudBackgroundProps> = ({ children }) => {
  const clouds = [
    { width: 600, speed: '60s', delay: '-15s', top: 35, left: '80%' },
  ];

  return (
    <div className="relative w-full h-[45vh] overflow-hidden bg-linear-to-b from-[#2b8ff3] via-[#2583e8] to-[#74b0f1]">
      {/* Clouds layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {clouds.map((cloud, index) => (
          <div 
          key={index + 1}
          className="w-full absolute top-[50%] flex justify-between"
  style={{
    animation: "floatDown 12s ease-in-out infinite",
  }}>   
             <Image
              src="/kk.png"
              alt="cloud"
              width={cloud.width}
              height={Math.round(cloud.width * 0.5)}
              className="opacity-70 -ml-40"
              loading="eager"
              priority
            />
             <Image
              src="/kk.png"
              alt="cloud"
              width={cloud.width}
              height={Math.round(cloud.width * 0.5)}
              className="opacity-70  -mr-50"
              loading="eager"
              priority
            />
          </div>
        ))}
      </div>
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CloudBackground;
