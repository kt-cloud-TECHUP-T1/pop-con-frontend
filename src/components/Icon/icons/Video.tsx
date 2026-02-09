import * as React from 'react';
import type { SVGProps } from 'react';
const SvgVideo = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16M9.1 9.495c0-1.358 1.513-2.168 2.643-1.415l3.758 2.506.177.135a1.7 1.7 0 0 1-.177 2.693l-3.758 2.506c-1.13.753-2.643-.057-2.643-1.415zm1.8 4.822L14.378 12 10.9 9.683z"
    />
  </svg>
);
export default SvgVideo;
