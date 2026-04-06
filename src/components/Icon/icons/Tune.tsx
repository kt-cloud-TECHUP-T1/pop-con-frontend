import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTune = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.5 12.5a3.5 3.5 0 0 1 3.355 2.5H20a1 1 0 1 1 0 2h-7.145a3.501 3.501 0 0 1-6.71 0H4a1 1 0 1 1 0-2h2.146A3.5 3.5 0 0 1 9.5 12.5m0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m5-10A3.5 3.5 0 0 1 17.855 7H20a1 1 0 1 1 0 2h-2.145a3.501 3.501 0 0 1-6.71 0H4a1 1 0 0 1 0-2h7.146A3.5 3.5 0 0 1 14.5 4.5m0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"
    />
  </svg>
);
export default SvgTune;
