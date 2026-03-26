import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-screen md:h-[844px] md:w-[390px] bg-white md:rounded-[40px] md:shadow-2xl overflow-hidden relative flex flex-col border-x md:border-8 border-neutral-900">
        {/* Status Bar (Simulated) */}
        <div className="h-12 bg-white flex items-center justify-between px-8 pt-4 shrink-0">
          <span className="text-sm font-semibold">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full border-2 border-black" />
            <div className="w-4 h-4 rounded-full border-2 border-black" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          {children}
        </div>
        
        {/* Home Indicator (Simulated) */}
        <div className="h-8 bg-white flex items-center justify-center shrink-0">
          <div className="w-32 h-1.5 bg-neutral-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
