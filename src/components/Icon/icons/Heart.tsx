import * as React from 'react';
import type { SVGProps } from 'react';
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 4.801c2.119-2.229 5.61-2.446 7.976-.329 2.565 2.295 2.712 6.36.328 8.849l-.012.011-7.082 7.156-.001-.001a1.683 1.683 0 0 1-2.419 0l-7.082-7.155-.012-.011c-2.384-2.488-2.237-6.554.328-8.849 2.367-2.117 5.857-1.9 7.976.33m6.642 1.161c-1.675-1.497-4.209-1.218-5.547.644l-.283.392a1.002 1.002 0 0 1-1.625 0l-.282-.392c-1.338-1.862-3.872-2.141-5.547-.644-1.717 1.537-1.823 4.3-.217 5.975L12 18.867l6.86-6.93c1.605-1.676 1.5-4.438-.218-5.975"
    />
  </svg>
);
export default SvgHeart;
