// components
import { useEffect } from 'react';
import { LiveChat } from './components/live-chat';
import { ScrollToTop } from './components/ScrollToTop';
import Modal from './components/Modal';
// hooks
import useAuth from './hooks/useAuth';
// pages
import Loading from './pages/Loading';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// utils
import { SnackbarUtilsConfigurator } from './utils/snackbar';
//Google Analytics
import ReactGA from 'react-ga';
const TRACKING_ID = 'G-PK14XW50C6';

const App = () => {
	useEffect(() => {
		ReactGA.initialize(TRACKING_ID);
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);
	const { isInitialized } = useAuth();
	return isInitialized ? (
		<ThemeConfig>
			<LiveChat />
			<ScrollToTop />
			<SnackbarUtilsConfigurator />
			<Modal />
			<Router />
		</ThemeConfig>
	) : (
		<Loading />
	);
};

export default App;
