import * as React from 'react';
import type { SVGProps } from 'react';
const SvgChevronLeftSmall = (props: SVGProps<SVGSVGElement>) => (
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
      d="M13.793 6.293a1 1 0 1 1 1.414 1.414L10.914 12l4.293 4.293a1 1 0 1 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414z"
    />
  </svg>
);
export default SvgChevronLeftSmall;
