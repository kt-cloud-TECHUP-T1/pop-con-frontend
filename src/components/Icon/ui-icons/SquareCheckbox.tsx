import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSquareCheckbox = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#fff"
      d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"
    />
    <path
      fill="#0a0a0a"
      fillOpacity={0.16}
      d="M17 3a4 4 0 0 1 4 4v10a4 4 0 0 1-3.794 3.995L17 21H7l-.206-.005a4 4 0 0 1-3.79-3.789L3 17V7a4 4 0 0 1 4-4zM7 4.5A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h10a2.5 2.5 0 0 0 2.5-2.5V7A2.5 2.5 0 0 0 17 4.5z"
    />
  </svg>
);
export default SvgSquareCheckbox;
