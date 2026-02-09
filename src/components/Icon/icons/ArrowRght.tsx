import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowRght = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12.293 4.293a1 1 0 0 1 1.414 0l7 7 .068.076a1 1 0 0 1-.068 1.338l-7 7a1 1 0 0 1-1.414-1.414L17.586 13H3a1 1 0 0 1 0-2h14.586l-5.293-5.293a1 1 0 0 1 0-1.414"
    />
  </svg>
);
export default SvgArrowRght;
