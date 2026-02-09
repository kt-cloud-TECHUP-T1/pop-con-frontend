import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPinFill = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 2c4.384 0 8 3.435 8 7.75 0 3.936-2.074 6.035-3.24 7.4-1.518 1.776-2.705 3.03-3.377 3.761-.407.442-.99.551-1.382.552-.392 0-.976-.106-1.385-.547-.645-.696-1.776-1.895-3.376-3.767C6.074 15.785 4 13.686 4 9.75 4 5.435 7.616 2 12 2m0 5.1a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8"
    />
  </svg>
);
export default SvgPinFill;
