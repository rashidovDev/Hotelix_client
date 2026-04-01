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
    <div className="relative w-full h-[75vh] overflow-hidden bg-gradient-to-b from-[#51a3f5] via-[#9ac0e8] to-[#e6d9cd]">
      {/* Clouds layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {clouds.map((cloud, index) => (
          <div 
          key={index + 1}
          className="w-full absolute top-[40%] flex justify-between"
  style={{
    animation: "floatDown 12s ease-in-out infinite",
  }}>   
             <Image
              src="/kk.png"
              alt="cloud"
              width={cloud.width}
              height={Math.round(cloud.width * 0.5)}
              className="opacity-30 -ml-40"
              loading="eager"
              priority
            />
             <Image
              src="/kk.png"
              alt="cloud"
              width={cloud.width}
              height={Math.round(cloud.width * 0.5)}
              className="opacity-30  -mr-50"
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
