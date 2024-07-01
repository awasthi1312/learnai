// hoc/withAuth.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';

const toLogin = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated()) {
        console.log("Not authenticated");
        router.push('/auth/login');
      } else {
        setIsLoading(false);
      }
    }, []);

    if (isLoading) {
      return <div>Loading...</div>; // You can customize this loading component
    }

    return <WrappedComponent {...props} />;
  };
};

export default toLogin;