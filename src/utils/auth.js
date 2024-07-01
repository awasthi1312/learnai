// utils/auth.js

import jwt from 'jsonwebtoken';

export const isAuthenticated = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return false;

  try {
    console.log(token);
    console.log("process.env.NEXT_PUBLIC_JWT_SECRET",process.env.NEXT_PUBLIC_JWT_SECRET);
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    console.log("decoded");
    console.log("decoded",decoded);
    return !!decoded;
  } catch (error) {
    console.log("error",error);
    return false;
  }
};