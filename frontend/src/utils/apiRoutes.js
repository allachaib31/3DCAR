//export const host = `http://localhost:5000/`
export const host = `/`
// admin routes
// auth
export const authAdminRoute = `${host}api/v1.0/admin/auth`;
export const forgetPasswordAdminRoute = `${host}api/v1.0/admin/forgot-password`;
export const resetPasswordAdminRoute = `${host}api/v1.0/admin/reset-password/`
export const isValidateTokenRoute = `${host}api/v1.0/admin/isValidateToken`;
// manage admin
export const addAdminRoute = `${host}api/v1.0/admin/addAdmin`;
export const renewSubscriptionRoute = `${host}api/v1.0/admin/renewSubscription`;
export const deleteAdminRoute = `${host}api/v1.0/admin/deleteAdmin`;
export const getAdminsRoute = `${host}api/v1.0/admin/getAdmins`;
// manage user
export const addUserRoute = `${host}api/v1.0/admin/addUser`;
export const changeStatusUserRoute = `${host}api/v1.0/admin/changeStatus`;
export const deleteUserRoute = `${host}api/v1.0/admin/deleteUser`;
export const uploadImageRoute = `${host}api/v1.0/admin/updateImageUser`;
export const updateUserBlockedRoute = `${host}api/v1.0/admin/updateUserBlocked`;
export const getUsersRoute = `${host}api/v1.0/admin/getUsers`;

// client routes
//auth
export const authClientRoute = `${host}api/v1.0/client/auth`;
export const isValidateTokenRouteClient = `${host}api/v1.0/client/isValidateToken`;

// manage file
export const getFileRoute = `${host}api/v1.0/file/`