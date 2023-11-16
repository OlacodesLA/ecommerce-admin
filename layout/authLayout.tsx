import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className=" flex justify-center items-center h-screen  pb-10">
      <div className="-translate-y-5 max-w-3xl mx-auto md:w-[400px] px-3">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
