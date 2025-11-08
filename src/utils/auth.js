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
    // console.log(permissions,"permissionspermissions");
    return permissions?.some(p => p.key === permissionKey);
  };
  
  // Save user data to sessionStorage
  export const setCurrentUser = (userData) => {
    sessionStorage.setItem('userDetails', JSON.stringify(userData));
  };
  
  // Clear session
  export const clearSession = () => {
    sessionStorage.removeItem('userDetails');
  };