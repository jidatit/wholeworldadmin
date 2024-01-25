import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentAdmin, setcurrentAdmin] = useState(() => {
    const savedUser = localStorage.getItem('currentAdmin');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [adminHere, setadminHere] = useState(() => {
    const savedadminHere = localStorage.getItem('adminHere');
    return savedadminHere ? JSON.parse(savedadminHere) : null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'admins', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setcurrentAdmin(user);
            setadminHere(true);
            localStorage.setItem('currentAdmin', JSON.stringify(user));
            localStorage.setItem('adminHere', JSON.stringify(true));
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        setcurrentAdmin(null);
        setadminHere(false);
        localStorage.removeItem('currentAdmin');
        localStorage.setItem('adminHere', JSON.stringify(false));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentAdmin, adminHere }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;