import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 3a1 1 0 0 1 1 1v14.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-7 7-.076.068a1 1 0 0 1-1.338-.068l-7-7a1 1 0 1 1 1.414-1.414L11 18.586V4a1 1 0 0 1 1-1"
    />
  </svg>
);
export default SvgArrowDown;
