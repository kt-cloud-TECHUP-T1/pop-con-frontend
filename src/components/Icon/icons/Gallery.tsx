import * as React from 'react';
import type { SVGProps } from 'react';
const SvgGallery = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19 2a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm-7.809 10.162a1 1 0 0 0-1.416-.07L4.673 16.74 4 17.352V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.751l-1.939 1.455a3 3 0 0 1-4.027-.39zM5 4a1 1 0 0 0-1 1v9.648l4.429-4.034a3 3 0 0 1 4.248.208l2.842 3.152a1 1 0 0 0 1.342.13l2.54-1.904.599-.451V5a1 1 0 0 0-1-1zm11 2.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4"
    />
  </svg>
);
export default SvgGallery;
