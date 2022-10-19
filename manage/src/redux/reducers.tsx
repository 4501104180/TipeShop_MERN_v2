// slices
import accountReducer from './slices/account';
import accessControlReducer from './slices/accessControl';
import productReducer from './slices/product';
import orderReducer from './slices/order';

const rootReducer = {
  accessControl: accessControlReducer,
  account: accountReducer,
  product: productReducer,
  order: orderReducer,
};

export default rootReducer;
