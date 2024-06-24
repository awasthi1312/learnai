// hoc/withAuth.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth'

const toLogin = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        console.log("Not authenticated");
        router.push('/auth/login');
      }
    }, []);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };
};

export default toLogin;
