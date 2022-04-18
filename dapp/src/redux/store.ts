import {configureStore} from '@reduxjs/toolkit';

import blurReducer from './slices/blur';
import chainBalanceReducer from './slices/chainBalance';
import totalStakedReducer from './slices/totalStaked';
import unclaimedRewardsReducer from './slices/unclaimedRewards';
import zkpMarketPriceReducer from './slices/zkpMarketPrice';
import zkpStakedBalanceReducer from './slices/zkpStakedBalance';

export const store = configureStore({
    reducer: {
        chainBalance: chainBalanceReducer,
        totalStaked: totalStakedReducer,
        zkpMarketPrice: zkpMarketPriceReducer,
        blur: blurReducer,
        zkpStakedBalance: zkpStakedBalanceReducer,
        unclaimedRewards: unclaimedRewardsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
