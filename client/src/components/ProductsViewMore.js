import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { styled } from '@mui/material/styles';
import { CircularProgress, Skeleton, Stack, Typography } from '@mui/material';

// components
import ProductCard from './ProductCard';
import useInfiniteProduct from '../hooks/useInfiniteProduct';

const propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    products: PropTypes.array,
};

const SkeletonLoad = (
	<Stack spacing={3}>
		<Stack direction="row" >
			{[...Array(5)].map((_, index) => (
				<Stack key={index} sx={{ p: 2 }}>
					<Skeleton variant="rectangular" width={180} height={180} />
					<Skeleton variant="text" height={45} />
					<Skeleton variant="text" width={150} />
					<Skeleton variant="text" width={130} />
				</Stack>
			))}
		</Stack>
		<Stack direction="row" >
			{[...Array(5)].map((_, index) => (
				<Stack key={index} sx={{ p: 2 }}>
					<Skeleton variant="rectangular" width={180} height={180} />
					<Skeleton variant="text" height={45} />
					<Skeleton variant="text" width={150} />
					<Skeleton variant="text" width={130} />
				</Stack>
			))}
		</Stack>
	</Stack>
);

const ProductViewMore = ({ title, type }) => {
    const [page, setPage] = useState(1);
	const { isLoading, hasMore, products } = useInfiniteProduct(page, 10, type);
    const handleLoadMore = () => {
		setPage((prevPage) => prevPage + 1);
	};
    console.log(products);
    return (
        <Stack>
            <Title variant="h6">{title}</Title>
            <Wrapper>
                <Fragment>
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    <LoadMore>
					{!isLoading && hasMore && (
						<LoadButton onClick={handleLoadMore}>
							<Typography variant="subtitle2">Load more</Typography>
						</LoadButton>
					)}
					{isLoading && <CircularProgress size={25} color="error" />}
                    {!products && SkeletonLoad}
				</LoadMore>
                </Fragment>
            </Wrapper>
        </Stack>
    );
};

const Wrapper = styled('div')({
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '50px',
});

const Title = styled(Typography)({
    textAlign: 'center',
})

const LoadMore = styled('div')({
	position: 'absolute',
	bottom: '-70px',
	left: '30%',
	width: '40%',
	height: '50px',
	margin: '10px 0',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const LoadButton = styled('div')(({ theme }) => ({
	width: '100%',
	padding: '15px',
	borderRadius: '15px',
	backgroundColor: theme.palette.background.paper,
	boxShadow: '5px 3px 7px rgb(145 158 171 / 24%)',
	transition: '0.5s',
	cursor: 'pointer',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	'&:hover': {
		color: '#fff',
		backgroundColor: theme.palette.error.main,
	},
}));

ProductViewMore.propTypes = propTypes;

export default ProductViewMore;
