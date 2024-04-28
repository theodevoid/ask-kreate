import React, { SVGProps } from "react";

export const TwitchLogoIcon = React.forwardRef<
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
      <g clipPath="url(#clip0_102_275)">
        <path
          d="M18.043 9.429l-2.857 2.857H12.33l-2.5 2.5v-2.5H6.615V1.572h11.428v7.857z"
          fill="#fff"
        />
        <path
          d="M5.9.143L2.33 3.715v12.857h4.285v3.571l3.571-3.571h2.857l6.429-6.429v-10H5.901zM18.044 9.43l-2.857 2.857H12.33l-2.5 2.5v-2.5H6.615V1.572h11.428v7.857z"
          fill="#9146FF"
        />
        <path
          d="M15.9 4.072h-1.428v4.285h1.429V4.072zM11.972 4.072h-1.429v4.285h1.429V4.072z"
          fill="#9146FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_102_275">
          <path fill="#fff" transform="translate(.9 .143)" d="M0 0H20V20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
});
