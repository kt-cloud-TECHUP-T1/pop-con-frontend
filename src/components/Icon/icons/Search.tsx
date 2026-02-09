import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.5 2a7.5 7.5 0 0 1 5.962 12.048l5.745 5.745a1 1 0 1 1-1.414 1.414l-5.745-5.745A7.5 7.5 0 1 1 9.5 2m0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11"
    />
  </svg>
);
export default SvgSearch;
