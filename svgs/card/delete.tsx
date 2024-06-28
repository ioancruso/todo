import { SVGProps } from "react";

function DeleteSvg(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={40}
			height={40}
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M10 12v5M14 12v5M4 7h16M6 10v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
			/>
		</svg>
	);
}
export { DeleteSvg };
