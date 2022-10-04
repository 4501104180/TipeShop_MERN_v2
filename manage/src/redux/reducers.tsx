// slices
import accountReducer from './slices/account';
import accessControlReducer from './slices/accessControl';
import productReducer from './slices/product';

const rootReducer = {
  accessControl: accessControlReducer,
  account: accountReducer,
  product: productReducer,
};

export default rootReducer;
