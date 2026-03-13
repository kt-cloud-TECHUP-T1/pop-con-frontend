import * as React from 'react';
import type { SVGProps } from 'react';

const SvgClock = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16m.5 4a1 1 0 0 0-2 0v4.586l3.707 3.707a1 1 0 0 0 1.414-1.414L12.5 11.586z"
    />
  </svg>
);

export default SvgClock;
