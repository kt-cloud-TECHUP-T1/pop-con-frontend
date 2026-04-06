import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCirclePoint = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 2.1c5.468 0 9.9 4.433 9.9 9.9s-4.432 9.9-9.9 9.9c-5.467 0-9.9-4.432-9.9-9.9 0-5.467 4.433-9.9 9.9-9.9m0 1.8a8.1 8.1 0 1 0 0 16.2 8.1 8.1 0 0 0 0-16.2m.842 4.1c1.895 0 3.064 1.178 3.058 2.89.005 1.733-1.186 2.876-3.116 2.876h-1.408v1.646a.988.988 0 1 1-1.976 0V9.096C9.4 8.491 9.89 8 10.495 8zm-1.266 1.601a.2.2 0 0 0-.2.2v2.2a.2.2 0 0 0 .2.199h.847c.936.005 1.43-.516 1.43-1.31 0-.784-.494-1.289-1.43-1.289z"
    />
  </svg>
);
export default SvgCirclePoint;
