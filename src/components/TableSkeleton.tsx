import { ContactSkeleton } from "./ContactSkeleton";
import { Fragment } from "react";

type Props = {
	numberOfRows: number;
	numberOfColumns: number;
};

export function TableSkeleton(props: Props) {
	const skeletonRows = [...Array(props.numberOfRows)].map((value, index) => (
		<ContactSkeleton key={index} numberOfColumns={props.numberOfColumns} />
	));
	return <Fragment>{skeletonRows}</Fragment>;
}
