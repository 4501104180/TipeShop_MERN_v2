import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//Components
import Page from '../components/Page';
import Teleport from '../components/Teleport';
import ProductsViewMore from '../components/ProductSearch';

const Search = () => {
	const [title, setTitle] = useState('');
	const { keyword } = useParams();
	useEffect(() => {
		const getTitle = () => {
			if (keyword) {
				setTitle('Search keyword: "' + keyword + '"');
			} else {
				setTitle('It Nothing');
			}
		};
		getTitle();
	}, [keyword]);
	return (
		<Page title="Tipe Shop - Buy online, good price, good quality, fast shipping">
			<Container>
				<Teleport />
				<ProductsViewMore title={title} type={keyword} />
			</Container>
		</Page>
	);
};

export default Search;
