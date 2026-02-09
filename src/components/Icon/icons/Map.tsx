import * as React from 'react';
import type { SVGProps } from 'react';
const SvgMap = (props: SVGProps<SVGSVGElement>) => (
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
      d="M8.643 3.066a1 1 0 0 1 .828.051L15 6.065l3.765-2.006C20.23 3.277 22 4.339 22 6v9.6a3 3 0 0 1-1.588 2.647l-4.941 2.636a1 1 0 0 1-.942 0L9 17.933l-3.764 2.008C3.77 20.723 2 19.661 2 18V8.4a3 3 0 0 1 1.588-2.647l4.941-2.636zM10 16.2l4 2.133V7.8l-4-2.133zM20 6a.2.2 0 0 0-.294-.177L16 7.8v10.533l3.47-1.85A1 1 0 0 0 20 15.6zM4.53 7.518A1 1 0 0 0 4 8.4V18a.2.2 0 0 0 .294.177L8 16.2V5.667z"
    />
  </svg>
);
export default SvgMap;
