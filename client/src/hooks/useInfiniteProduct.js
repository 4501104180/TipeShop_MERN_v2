import { useState, useEffect } from 'react';

// apis
import productApi from '../apis/productApi';

const useInfiniteProduct = (page, number, type = 'all') => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(false);
	useEffect(() => {
		const getProducts = async () => {
			setIsLoading(true);
			let res = [];
			switch (type) {
				case 'sold' || 'favorite' || 'view':
					res = await productApi.findRankingProducts(type, page, number );
					break;
				default:
					res = await productApi.findAllWithPagination(page, number);
					break;
			}
			setProducts((prevProducts) => {
				return [...prevProducts, ...res.products];
			});
			setHasMore(page < res.pagination.totalPage);
			setIsLoading(false);
		};
		getProducts();
	}, [page, number, type]);
	return { isLoading, hasMore, products };
};

export default useInfiniteProduct;
