import * as React from 'react';
import type { SVGProps } from 'react';
const SvgBellFill = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14 20a1 1 0 1 1 0 2h-4a1 1 0 0 1 0-2zM12 2a1 1 0 0 1 1 1v1.066c1.915.252 3.459 1.222 4.548 2.626 1.254 1.618 1.88 3.77 1.88 6v.693c0 .882.11 1.473.271 1.898.156.411.378.716.684 1.004.494.467.588 1.131.418 1.656-.176.54-.682 1.057-1.437 1.057H4.636c-.755 0-1.261-.517-1.437-1.057a1.6 1.6 0 0 1 .418-1.656l.214-.22c.199-.227.353-.476.47-.784.16-.425.27-1.016.27-1.898v-.693c0-2.23.627-4.382 1.881-6C7.542 5.288 9.085 4.318 11 4.066V3a1 1 0 0 1 1-1"
    />
  </svg>
);
export default SvgBellFill;
