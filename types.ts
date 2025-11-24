export enum AppView {
  USER_WIZARD = 'USER_WIZARD',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export enum WizardStep {
  LANDING = 0,
  EMAIL_INPUT = 1,
  OTP_INPUT = 2,
  FORM = 3,
  SUCCESS = 4,
}

export interface ReceiptFormData {
  partyName: string;
  email: string;
  utrNo: string;
  invoiceAmount: string;
  caseType: 'Export' | 'Import' | 'Others' | '';
  invoiceNo: string;
}

export interface AdminUser {
  email: string;
  token: string;
}

export const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@cosco.com',
  password: 'password123'
};
