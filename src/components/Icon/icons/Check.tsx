import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17.83 6.58a1.3 1.3 0 1 1 1.84 1.84l-9 9a1.3 1.3 0 0 1-1.838 0l-4.5-4.5a1.3 1.3 0 1 1 1.838-1.838l3.58 3.58z"
    />
  </svg>
);
export default SvgCheck;
