import { Route, Routes, redirect } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import {useRecoilState} from 'recoil'
import {user as userState} from '../../hooks/atom/user';


function ProtectedRoute(props: any) {
    const admin = true;

    return admin ? <Route {...props} /> : window.location.href = '/login';
}

export default ProtectedRoute;