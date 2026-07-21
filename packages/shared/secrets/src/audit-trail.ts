export const auditTrail = (key: string, action: string): void => {
  console.log(`[Secret Audit] ${new Date().toISOString()}: ${action} for key: ${key}`);
};
