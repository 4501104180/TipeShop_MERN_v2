import { all } from 'redux-saga/effects';

// slices
import { accountSaga } from './slices/account';
import { accessControlSaga } from './slices/accessControl';
import { productSaga } from './slices/product';
import { orderSaga } from './slices/order';
export default function* rootSaga() {
  yield all([accountSaga(), accessControlSaga(), productSaga(), orderSaga()]);
}
