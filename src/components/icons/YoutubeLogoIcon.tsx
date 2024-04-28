import React, { SVGProps } from "react";

export const YoutubeLogoIcon = React.forwardRef<
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
      <g clipPath="url(#clip0_102_137)">
        <path
          d="M19.902 5.298a2.514 2.514 0 00-1.768-1.78c-1.564-.42-7.814-.42-7.814-.42s-6.25 0-7.814.42a2.514 2.514 0 00-1.768 1.78C.32 6.868.32 10.143.32 10.143s0 3.275.418 4.846a2.514 2.514 0 001.768 1.78c1.564.42 7.814.42 7.814.42s6.25 0 7.814-.42a2.514 2.514 0 001.768-1.78c.418-1.57.418-4.846.418-4.846s0-3.275-.418-4.845z"
          fill="#FF0302"
        />
        <path d="M8.274 13.117V7.17l5.228 2.974-5.228 2.974z" fill="#FEFEFE" />
      </g>
      <defs>
        <clipPath id="clip0_102_137">
          <path fill="#fff" transform="translate(.3 .143)" d="M0 0H20V20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
});
