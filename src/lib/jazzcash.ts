/**
 * JazzCash HMAC-SHA256 SDK for hosted payment page integration.
 * Based on the gateways repo implementation.
 */

const JAZZCASH_BASE_URL = process.env.JAZZCASH_ENV === 'production'
  ? 'https://payments.jazzcash.com.pk'
  : 'https://sandbox.jazzcash.com.pk';

interface JazzCashSessionParams {
  amountPkr: number;
  email: string;
  name?: string;
  description?: string;
  orderId?: string;
}

interface JazzCashPostData {
  pp_Version: string;
  pp_TxnType: string;
  pp_Language: string;
  pp_MerchantID: string;
  pp_SubMerchantID: string;
  pp_Password: string;
  pp_BankID: string;
  pp_ProductID: string;
  pp_TotalAmount: string;
  pp_TxnRefNo: string;
  pp_Amount: string;
  pp_TxnCurrency: string;
  pp_TxnDateTime: string;
  pp_BillReference: string;
  pp_Description: string;
  pp_ReturnURL: string;
  pp_CallbackURL?: string;
  pp_SecureHash: string;
  ppmpf_1?: string;
  ppmpf_2?: string;
  ppmpf_3?: string;
  ppmpf_4?: string;
  ppmpf_5?: string;
}

import { createHmac } from 'crypto';

function hmacSha256(message: string, key: string): string {
  return createHmac('sha256', key).update(message, 'utf8').digest('hex');
}

function sortAndConcat(data: Record<string, string>, excludeKeys: string[]): string {
  const sorted = Object.keys(data)
    .filter((k) => !excludeKeys.includes(k) && data[k] !== '' && data[k] !== undefined)
    .sort();
  return sorted.map((k) => `${k}&${data[k]}`).join('&');
}

export function createJazzCashSession(params: JazzCashSessionParams): {
  postData: Record<string, string>;
  apiUrl: string;
} | null {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID || 'MC828331';
  const password = process.env.JAZZCASH_PASSWORD;
  const salt = process.env.JAZZCASH_INTEGRITY_SALT;
  const returnUrl = process.env.JAZZCASH_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/jazzcash/callback`;
  const callbackUrl = process.env.JAZZCASH_IPN_URL;

  if (!password || !salt) return null;

  const txnDateTime = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const txnRefNo = `JC-${Date.now()}`;

  const amountStr = params.amountPkr.toFixed(2);

  const data: Record<string, string> = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: merchantId,
    pp_SubMerchantID: '',
    pp_Password: password,
    pp_BankID: 'TBANK',
    pp_ProductID: 'RECURRING',
    pp_TotalAmount: amountStr,
    pp_TxnRefNo: txnRefNo,
    pp_Amount: amountStr,
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: params.orderId || txnRefNo,
    pp_Description: params.description || `Payment for ${params.email}`,
    pp_ReturnURL: returnUrl,
  };

  if (callbackUrl) {
    data.pp_CallbackURL = callbackUrl;
  }

  if (params.email) {
    data.ppmpf_1 = params.email;
  }
  if (params.name) {
    data.ppmpf_2 = params.name;
  }
  if (params.orderId) {
    data.ppmpf_3 = params.orderId;
  }

  // Generate secure hash
  const sortedString = sortAndConcat(data, ['pp_SecureHash']);
  const secureHash = hmacSha256(sortedString, salt);
  data.pp_SecureHash = secureHash.toUpperCase();

  return {
    postData: data,
    apiUrl: `${JAZZCASH_BASE_URL}/application/index.jsp`,
  };
}

export function verifyJazzCashCallback(params: Record<string, string>): boolean {
  const salt = process.env.JAZZCASH_INTEGRITY_SALT;
  if (!salt) return false;

  const sortedString = sortAndConcat(params, ['pp_SecureHash', 'pp_RetryData']);
  const expectedHash = hmacSha256(sortedString, salt).toUpperCase();

  return params.pp_SecureHash?.toUpperCase() === expectedHash;
}