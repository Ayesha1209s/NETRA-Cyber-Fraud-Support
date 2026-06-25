// backend/utils/caseIdGenerator.js
const generateCaseId = () => {
  const currentYear = new Date().getFullYear(); // Dynamic calculation (e.g., 2026)
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `NETRA-OD-${currentYear}-${randomDigits}`;
};

module.exports = generateCaseId;