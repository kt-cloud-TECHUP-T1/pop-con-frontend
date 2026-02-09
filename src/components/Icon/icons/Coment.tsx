import * as React from 'react';
import type { SVGProps } from 'react';
const SvgComent = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19 2a3 3 0 0 1 3 3v11l-.004.154A3 3 0 0 1 19 19h-4.465l-1.703 2.555a1 1 0 0 1-1.664 0L9.465 19H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h5a1 1 0 0 1 .757.347l.075.098L12 19.197l1.168-1.752A1 1 0 0 1 14 17h5a1 1 0 0 0 .995-.898L20 16V5a1 1 0 0 0-1-1zm3 5.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4m4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4m4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4"
    />
  </svg>
);
export default SvgComent;
