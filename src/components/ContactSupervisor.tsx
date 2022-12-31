import { useEffect, useState } from "react";
import supervisorCache from "../services/SupervisorCache";
import { Supervisor } from "../models/Supervisor";
import { Skeleton } from "@mui/material";

export interface Props {
	contactId: number;
}

export function ContactSupervisor(props: Props) {
	const [supervisor, setSupervisor] = useState<Supervisor | null>();

	useEffect(() => {
		async function fetchData() {
			try {
				const supervisor = await supervisorCache.getSupervisor(props.contactId);

				if (supervisor !== undefined) {
					setSupervisor(supervisor);
				}
			} catch (error) {
				console.log(`ContactSupervisor - An error occurred: ${error}`);
				setSupervisor(null);
			}
		}

		setTimeout(fetchData, getRandomDelay());
	}, [props.contactId]);

	return supervisor ? (
		<div>
			<div>{supervisor.name}</div>
			<div>{supervisor.position}</div>
		</div>
	) : supervisor === null ? (
		<div>-----</div>
	) : (
		<Skeleton variant="rectangular" />
	);
}

function getRandomDelay() {
	const maxDelayInMs = 3500;
	return Math.floor(Math.random() * maxDelayInMs);
}
