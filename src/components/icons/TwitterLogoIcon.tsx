import React, { SVGProps } from "react";

export const TwitterLogoIcon = React.forwardRef<
  SVGProps<SVGElement>,
  React.SVGAttributes<SVGElement>
>(({ ...props }) => {
  return (
    <svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.972 1.73h2.811l-6.142 7.02 7.226 9.551h-5.658l-4.43-5.793-5.07 5.793H1.894l6.57-7.508L1.533 1.73h5.801l4.005 5.295 4.633-5.295zm-.987 14.889h1.558L6.488 3.324H4.816l10.17 13.295z"
        fill="#000"
      />
    </svg>
  );
});
