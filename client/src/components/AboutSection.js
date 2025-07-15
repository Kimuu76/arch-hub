/** @format */

import React from "react";
import { Box, Typography, Link, Stack, Paper, useTheme } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AboutSection = () => {
	const theme = useTheme();

	return (
		<Paper
			elevation={4}
			sx={{
				bgcolor: theme.palette.background.default,
				borderRadius: 3,
				p: { xs: 4, md: 6 },
				mt: 10,
				mb: 6,
				mx: "auto",
				maxWidth: 900,
				textAlign: "center",
				boxShadow: theme.shadows[4],
			}}
		>
			<Stack
				direction='row'
				spacing={1}
				alignItems='center'
				justifyContent='center'
				mb={2}
			>
				<InfoOutlinedIcon color='primary' fontSize='large' />
				<Typography variant='h4' fontWeight={800}>
					About AMF Home Designs
				</Typography>
			</Stack>

			<Typography
				variant='body1'
				color='text.secondary'
				sx={{ mb: 3, maxWidth: 700, mx: "auto", lineHeight: 1.8 }}
			>
				We're passionate about helping families build affordable homes with
				smart, ready-to-build plans. ArchiManfe began with one goal: make
				architecture more accessible, beautiful, and buildable.
			</Typography>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={3}
				alignItems='center'
				justifyContent='center'
				mt={3}
			>
				<Stack direction='row' spacing={1} alignItems='center'>
					<WhatsAppIcon color='success' />
					<Link
						href='https://wa.me/254717365839'
						target='_blank'
						rel='noopener noreferrer'
						underline='hover'
						variant='body1'
						fontWeight={600}
					>
						+254 717 365 839
					</Link>
				</Stack>

				<Stack direction='row' spacing={1} alignItems='center'>
					<EmailIcon color='action' />
					<Link
						href='mailto:info@archimanfe.com'
						underline='hover'
						variant='body1'
						fontWeight={600}
					>
						info@archimanfe.com
					</Link>
				</Stack>
			</Stack>
		</Paper>
	);
};

export default AboutSection;
