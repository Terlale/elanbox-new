import React, { useEffect } from 'react'
import AuthProvider from './auth/AuthProvider'
import Router from './router/Router'
import { getProfileThunk } from './redux/thunks/authThunks';
import { fetchFavorites } from './redux/thunks/listingThunks';
import { fetchBlockedUsers } from './redux/thunks/blockThunks';
import { setAuthFromStorage } from './redux/slices/authSlice';
import { decodeJWT } from './utils/decodeJWT';
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(setAuthFromStorage());

      const decoded = decodeJWT(token);
      const uid = decoded?.jti || decoded?.id || decoded?.userId || decoded?.sub || decoded?.user_id;

      dispatch(getProfileThunk()).then((res) => {
        if (res.payload?.id) {
          dispatch(fetchFavorites(res.payload.id));
        }
      });
    }
  }, [dispatch]);

  return (
    <div className="main-app-container">
      <AuthProvider>
        <Router />
      </AuthProvider>
    </div>
  )
}

export default App