import * as React from 'react';
import type { SVGProps } from 'react';
const SvgShare = (props: SVGProps<SVGSVGElement>) => (
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
      d="M18 1.9a3.1 3.1 0 0 1 0 6.2c-.83 0-1.581-.328-2.138-.859l-6.85 4.029a3.1 3.1 0 0 1 .052 1.196l6.998 4.116a3.1 3.1 0 1 1-1.076 1.688l-6.848-4.029a3.1 3.1 0 0 1-2.138.86 3.1 3.1 0 0 1 0-6.2c.733 0 1.406.255 1.937.681l6.997-4.116A3.1 3.1 0 0 1 18 1.9m0 16a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2m-12-7a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2m12-7a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2"
    />
  </svg>
);
export default SvgShare;
