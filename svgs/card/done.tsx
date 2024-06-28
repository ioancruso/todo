import { SVGProps } from "react";

function DoneSvg(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={800}
			height={800}
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeWidth={2}
				d="M19.548 7.267a2 2 0 1 0-3.096-2.533L8.666 14.25 6.2 12.4a2 2 0 0 0-2.4 3.2l3.233 2.425a3 3 0 0 0 4.122-.5l8.393-10.258Z"
			/>
		</svg>
	);
}
export { DoneSvg };
