import { all } from 'redux-saga/effects';

// slices
import { accountSaga } from './slices/account';
import { accessControlSaga } from './slices/accessControl';
import { productSaga } from './slices/product';
export default function* rootSaga() {
  yield all([accountSaga(), accessControlSaga(),  productSaga() ]);
}
