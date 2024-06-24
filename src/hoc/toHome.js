// hoc/withAuthRedirect.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';

const toHome = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated()) {
        router.push('/home');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default toHome;
