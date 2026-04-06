import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.293 4.293a1 1 0 0 1 1.414 1.414L5.414 11H20a1 1 0 0 1 0 2H5.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7-.068-.076a1 1 0 0 1 .068-1.338z"
    />
    <path
      fill="currentColor"
      d="M9.293 4.293a1 1 0 1 1 1.414 1.414L5.414 11H20a1 1 0 0 1 0 2H5.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7-.068-.076a1 1 0 0 1 .068-1.338z"
    />
  </svg>
);
export default SvgArrowLeft;
