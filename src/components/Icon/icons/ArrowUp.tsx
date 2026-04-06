import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.37 3.225a1 1 0 0 1 1.337.068l7 7a1 1 0 0 1-1.414 1.414L13 6.414V21a1 1 0 0 1-2 0V6.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l7-7z"
    />
  </svg>
);
export default SvgArrowUp;
