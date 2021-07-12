import {$fetch} from './index.js';
import api from './api.js';

export const userLoginIn = (data, success) => $fetch(api.sso.loginIn, data, 'POST');
export const userRegister = (data, success) => $fetch(api.sso.register, data, 'POST');
export const userLogOut = (data, success) => $fetch(api.sso.logOut, data, 'POST');
export const resetPassword = (data, success) => $fetch(api.sso.resetPassword, data, 'POST');

export const getCustomerList = (data, success) => $fetch(api.customer.getCustomerList, data, 'GET');
export const getAllCustomer = (data, success) => $fetch(api.customer.getAllCustomer, data, 'GET');

export const getMaterialList = (data, success) => $fetch(api.material.getMaterialList, data, 'GET');
export const getAllMaterials = (data, success) => $fetch(api.material.getAllMaterials, data, 'GET');

export const getUserList = (data, success) => $fetch(api.user.getUserList, data, 'GET');
export const getRegisteringUsers = (data, success) => $fetch(api.user.getRegisteringUsers, data, 'GET');
export const addUserRole = (data, success) => $fetch(api.user.addUserRole, data, 'POST');
export const editUserRole = (data, success) => $fetch(api.user.editUserRole, data, 'PUT');
export const getRoleList = (data, success) => $fetch(api.material.getRoleList, data, 'GET');

export const getQuotationList = (data, success) => $fetch(api.quotation.getQuotationList, data, 'GET');
export const addQuotation = (data, success) => $fetch(api.quotation.addQuotation, data, 'POST');
export const delQuotation = (data, success) => $fetch(api.quotation.delQuotation, data, 'DELETE');
export const editQuotation = (data, success) => $fetch(api.quotation.editQuotation, data, 'PUT');
export const auditQuotation = (data, success) => $fetch(api.quotation.auditQuotation, data, 'POST');
export const updateQuotaStatus = (data, success) => $fetch(api.quotation.updateQuotaStatus, data, 'PUT');

export const getContractList = (data, success) => $fetch(api.contract.getContractList, data, 'GET');
export const addContract = (data, success) => $fetch(api.contract.addContract, data, 'POST');
export const delContract = (data, success) => $fetch(api.contract.delContract, data, 'DELETE');
export const auditContract = (data, success) => $fetch(api.contract.auditContract, data, 'POST');
export const editContract = (data, success) => $fetch(api.contract.editContract, data, 'PUT');
export const updateContractStatus = (data, success) => $fetch(api.contract.updateContractStatus, data, 'PUT');

export const getQuotaFile = (data, success) => $fetch(api.getQuotaFile, data, 'GET');
export const getContractFile = (data, success) => $fetch(api.getContractFile, data, 'GET');
