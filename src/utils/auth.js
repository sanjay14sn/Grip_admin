// Get current user from sessionStorage
export const getCurrentUser = () => {
    const userData = sessionStorage.getItem('userDetails');
    return userData ? JSON.parse(userData) : null;
  };
  
  // Check specific permission
 export const hasPermission = (permissionKey) => {
    const user = getCurrentUser();
    // console.log(user,"useruser");
    const permissions = user?.data?.role?.permissions;
    console.log("permissionssssssss",permissions)
    // console.log(permissions,"permissionspermissions");
    return permissions?.some(p => p.key === permissionKey);
  }; 

  export const hasDeletePermission = (permissionKey) => {
  const user = getCurrentUser();
  const permissions = user?.data?.role?.permissions;

  return permissions?.some((p) => {
    const keyPart = p.key?.split('-').pop()?.toLowerCase(); // get last part after "-"
    return keyPart === permissionKey.toLowerCase();
  });
};

  
  // Save user data to sessionStorage
  export const setCurrentUser = (userData) => {
    sessionStorage.setItem('userDetails', JSON.stringify(userData));
  };
  
  // Clear session
  export const clearSession = () => {
    sessionStorage.removeItem('userDetails');
  };