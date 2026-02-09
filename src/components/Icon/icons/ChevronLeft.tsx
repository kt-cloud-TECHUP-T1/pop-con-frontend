import * as React from 'react';
import type { SVGProps } from 'react';
const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15.293 3.293a1 1 0 1 1 1.414 1.414L9.414 12l7.293 7.293a1 1 0 1 1-1.414 1.414l-8-8a1 1 0 0 1 0-1.414z"
    />
  </svg>
);
export default SvgChevronLeft;
