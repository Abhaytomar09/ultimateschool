import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Storage keys
const KEYS = {
    user:       'us_user',
    token:      'us_token',
    schoolCode: 'us_school_code',
    schoolName: 'us_school_name',
};

const readJSON = (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
};

export function AuthProvider({ children }) {
    // Restore user + school from previous session
    const [user,       setUser]       = useState(() => readJSON(KEYS.user));
    const [schoolCode, setSchoolCode] = useState(() => localStorage.getItem(KEYS.schoolCode) || '');
    const [schoolName, setSchoolName] = useState(() => localStorage.getItem(KEYS.schoolName) || '');

    /**
     * Call this after a successful login API response.
     * Persists user, token, schoolCode and schoolName.
     */
    const login = (userData) => {
        localStorage.setItem(KEYS.user,       JSON.stringify(userData));
        localStorage.setItem(KEYS.token,      userData.token || '');
        localStorage.setItem(KEYS.schoolCode, userData.schoolCode || '');
        localStorage.setItem(KEYS.schoolName, userData.schoolName || '');

        setUser(userData);
        setSchoolCode(userData.schoolCode || '');
        setSchoolName(userData.schoolName || '');
    };

    /**
     * Full logout — clears everything.
     */
    const logout = () => {
        Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
        setUser(null);
        setSchoolCode('');
        setSchoolName('');
    };

    /**
     * changeSchool — keeps user logged out but clears school context
     * so the login page shows the full form with School Code field.
     */
    const changeSchool = () => {
        localStorage.removeItem(KEYS.schoolCode);
        localStorage.removeItem(KEYS.schoolName);
        localStorage.removeItem(KEYS.user);
        localStorage.removeItem(KEYS.token);
        setSchoolCode('');
        setSchoolName('');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                schoolCode,
                schoolName,
                isLoggedIn: !!user,
                login,
                logout,
                changeSchool,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
