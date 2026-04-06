import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCircleCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 2c5.523 0 10 4.478 10 10s-4.477 10-10 10S2 17.523 2 12 6.478 2 12 2m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m3.272 4.648a1 1 0 0 1 1.457 1.371l-5.177 5.5a1 1 0 0 1-1.456 0l-2.824-3a1 1 0 0 1 1.457-1.371l2.095 2.225z"
    />
  </svg>
);
export default SvgCircleCheck;
