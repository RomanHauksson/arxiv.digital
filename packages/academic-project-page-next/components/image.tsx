import NextImage from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Image({
	className,
	...props
}: ComponentProps<typeof NextImage>) {
	return (
		<NextImage
			className={cn(
				"rounded-lg max-h-[calc(100svh-3rem)] max-w-full w-auto mx-auto h-auto",
				className,
			)}
			{...props}
		/>
	);
}
