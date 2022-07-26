import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { TEST_FORGOT_PASSWORD } from '../../config/ajax-path';
import RegisterForm from './RegisterForm';

function Register(props) {
    const { auth, setAuth } = props;
    // 嘗試進行頁面跳轉
    const navigate = useNavigate();

    return <RegisterForm />;
}

export default Register;
