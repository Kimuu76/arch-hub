/** @format */

// components/AdminHeader.js
import { Typography, Box } from "@mui/material";

const AdminHeader = ({ title, emoji }) => (
	<Box mb={3}>
		<Typography variant='h5' fontWeight={600}>
			{emoji} {title}
		</Typography>
	</Box>
);

export default AdminHeader;
