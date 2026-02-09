import * as React from 'react';
import type { SVGProps } from 'react';
const SvgChevronUp = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.37 7.225a1 1 0 0 1 1.337.068l8 8a1 1 0 0 1-1.414 1.414L12 9.414l-7.293 7.293a1 1 0 0 1-1.414-1.414l8-8z"
    />
  </svg>
);
export default SvgChevronUp;
