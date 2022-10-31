import PropTypes from 'prop-types';
import { Fragment, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import ProductCard from './ProductCard';
// apis
import productApi from '../apis/productApi';

const propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
	products: PropTypes.array,
};

const ProductSearch = ({ title, type }) => {
	const [searchProduct, setSearchProduct] = useState([]);
	useEffect(() => {
		const getSearchProduct = async () => {
			const response = await productApi.findByKeyword(type);
			setSearchProduct(response.data ? response.data : response);
		};
		getSearchProduct();
	}, [type]);
	return (
		<Stack>
			<Title variant="h6">{title}</Title>
			<Wrapper>
				<Fragment>
					{searchProduct.length > 0 &&
						searchProduct.map((product) => <ProductCard key={product._id} product={product} />)}
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
});

ProductSearch.propTypes = propTypes;

export default ProductSearch;
