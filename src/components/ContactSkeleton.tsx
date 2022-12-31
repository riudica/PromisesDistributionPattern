import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Skeleton } from "@mui/material";

type Props = {
	numberOfColumns: number;
};

export function ContactSkeleton(props: Props) {
	const skeletonRow = [...Array(props.numberOfColumns)].map((value, index) => (
		<TableCell key={index} align="right">
			<Skeleton variant="rectangular" />
		</TableCell>
	));
	return <TableRow>{skeletonRow}</TableRow>;
}
