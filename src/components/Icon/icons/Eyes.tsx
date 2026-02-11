import * as React from 'react';
import type { SVGProps } from 'react';
const SvgEyes = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 4c4.938 0 9.067 3.382 10.479 8-1.412 4.618-5.54 8.001-10.479 8.001S2.933 16.618 1.521 12C2.933 7.383 7.062 4 12 4m0 2c-3.771 0-7.042 2.468-8.368 6 1.326 3.532 4.597 6 8.368 6.001 3.771 0 7.042-2.469 8.368-6.001C19.042 8.468 15.771 6 12 6m0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
    />
  </svg>
);
export default SvgEyes;
