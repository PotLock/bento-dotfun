'use client';

import Navbar from "./Navbar";

const LayoutCustom = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default LayoutCustom;