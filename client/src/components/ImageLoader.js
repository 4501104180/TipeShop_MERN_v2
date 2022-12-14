import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	sx: PropTypes.object,
	sxImg: PropTypes.object,
};

const ImageLoader = ({ sx, sxImg, src, alt, ...others }) => (
	<RootStyle className='root-img' sx={sx} {...others}>
		<LazyLoadImage alt={alt} src={src} effect="blur" width="100%" style={sxImg} />
	</RootStyle>
);

const RootStyle = styled('div')({
	position: 'relative',
	overflow: 'hidden',
	'& span': {
		display: 'flex !important',
	}
});


ImageLoader.propTypes = propTypes;

export default ImageLoader;
