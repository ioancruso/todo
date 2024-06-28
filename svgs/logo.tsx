import { SVGProps } from "react";

function LogoSvg(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={70}
			height={70}
			fill="none"
			viewBox="0 0 192 192"
			{...props}
		>
			<path
				strokeWidth={12}
				d="M80 105.485 48.284 73.769a4 4 0 0 0-5.657 0l-19.799 19.8a4 4 0 0 0 0 5.656L65.603 142"
			/>
			<rect
				width={36}
				height={132}
				x={147.279}
				y={37}
				strokeLinejoin="round"
				strokeWidth={12}
				rx={4}
				transform="rotate(45 147.279 37)"
			/>
		</svg>
	);
}
export { LogoSvg };
