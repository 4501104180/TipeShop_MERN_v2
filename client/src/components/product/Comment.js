import { styled } from '@mui/material/styles';
import { Stack, Typography, Button } from '@mui/material';
import { ThumbUpOutlined } from '@mui/icons-material';

// components
import Hidden from '../Hidden';
import Avatar from '../Avatar';
import Stars from '../Stars';
import Response from './Response';
// constant
import { PRODUCT_PAGE } from '../../constant';

const Comment = () => (
	<RootStyle direction="row">
		<Hidden width="mdDown">
			<Stack direction="column" alignItems="center" sx={{ width: PRODUCT_PAGE.COMMENT_WIDTH }}>
				<Avatar name="Administrators" src="http://dotshop69.000webhostapp.com/Public/images/tue.png" />
				<Typography variant="subtitle2">Administrators</Typography>
				<Typography variant="body2">Joined 4 years ago</Typography>
			</Stack>
		</Hidden>
		<Stack sx={{ width: { xs: '100%', lg: `calc(100% - ${PRODUCT_PAGE.COMMENT_WIDTH})` } }}>
			<Hidden width="mdUp">
				<Stack direction="row" alignItems="center">
					<Avatar
						name="Administrators"
						src="http://dotshop69.000webhostapp.com/Public/images/tue.png"
						sx={{ width: '40px', height: '40px' }}
					/>
					<Stack sx={{ mx: 2 }}>
						<Typography variant="subtitle2">Administrators</Typography>
						<Typography variant="body2">Joined 4 years ago</Typography>
					</Stack>
				</Stack>
			</Hidden>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Stars total={5} rating={5} />
				<Typography variant="subtitle2">Very good</Typography>
			</Stack>
			<Typography variant="subtitle1">
				I placed an order when she mentioned price 999k, add a code to get 40k off. Groping around for half
				a day, I drew some information: About the product: - Full accessories, new drawing board without
				scratches - Heavier than H610 pro v2. If the H610 is thin and slightly curved at the edges, the
				bottom is completely flat - Durability is unknown, but works ok - The contact feeling between the
				tip of the pen and the board is a bit rough, for me, it is acceptable. connection: - Go to
				huion.com/download to download the driver and install it - Plug the drawing board into the lap and
				open the driver to adjust the parameters (driver interface as shown) - From here you can activate
				buttons, change functions function for the button under "Press keys". For example: use the shortcut
				Clrl + Z (undo command) for the first button - Use the wrong paint tool DO NOT select Enable Window
				Ink in the "Digital Pen" section, otherwise the stroke will be rough. - Choose Mouse mode to use as
				a mouse Delivery: - Corner dented box - International goods have a relative delivery time in
				advance, but tiki still texted apologizing for the goods to be 1 day late so ok satisfied - The
				shipper was polite Thank you guest. Sorry to the shipper for looking forward to and being in love
				with the product but forgot to thank you again :)))
			</Typography>
			<Typography variant="caption">Reviewed 5 months ago</Typography>
			<Stack direction="row" alignItems="center" spacing={2} my={1}>
				<Button variant="outlined" startIcon={<ThumbUpOutlined />}>
					Helpful (69)
				</Button>
				<Button variant="text">Reply</Button>
			</Stack>
			<Stack spacing={1}>
				<Response />
				<Response />
			</Stack>
		</Stack>
	</RootStyle>
);

const RootStyle = styled(Stack)(({ theme }) => ({
	padding: '20px 0',
	borderTop: `2px solid ${theme.palette.background.default}`,
}));

export default Comment;
