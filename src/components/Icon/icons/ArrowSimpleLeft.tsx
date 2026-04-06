import type { SVGProps } from 'react';
const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    {...props}
  >
    <path d="M17.77 3.77L16 2L6 12l10 10l1.77-1.77L9.54 12z" />
  </svg>
);
export default SvgArrowLeft;
