
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//Components
import Page from "../components/Page";
import Teleport from "../components/Teleport";
import ProductsViewMore from "../components/ProductsViewMore";

const ViewMore = () => {
	const [title, setTitle] = useState('');
	const { type } = useParams();
	useEffect(() => {
		const getTitle = () => {
			switch (type) {
				case 'sold':
					setTitle('🛍  Hot selling products');
					break;
				case 'favorite':
					setTitle('💖  Most likes products');
					break;
				case 'view':
					setTitle('👀  Top view products');
					break;
				default:
					setTitle('It Nothing')
					break;
			}
		};
		getTitle();
	}, [type])
	return (
		<Page title="Tipe Shop - Buy online, good price, good quality, fast shipping">
			<Container>
				<Teleport />
				<ProductsViewMore title={title} type={type} />
			</Container>
		</Page>
	)
};

export default ViewMore;