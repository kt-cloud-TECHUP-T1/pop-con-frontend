import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCalender = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#262626"
      d="M17 2a1 1 0 0 1 1 1v2h1a3 3 0 0 1 3 3v11l-.004.154A3 3 0 0 1 19 22H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h1V3a1 1 0 0 1 2 0v2h8V3a1 1 0 0 1 1-1M4 19a1 1 0 0 0 1 1h14a1 1 0 0 0 .995-.898L20 19v-6H4zM5 7a1 1 0 0 0-1 1v3h16V8a1 1 0 0 0-1-1z"
    />
  </svg>
);
export default SvgCalender;
