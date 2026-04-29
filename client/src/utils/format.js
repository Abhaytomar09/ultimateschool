// Format date as DD-MM-YYYY (Indian format)
export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// Format currency in ₹ (Indian Rupees)
export const formatRupees = (amount) => {
  if (amount === null || amount === undefined) return '₹ 0';
  return `₹ ${Number(amount).toLocaleString('en-IN')}`;
};

// Format display ID in uppercase
export const formatId = (id) => {
  if (!id) return '—';
  return id.toUpperCase();
};

// Get attendance color
export const getAttendanceColor = (pct) => {
  if (pct >= 75) return 'success';
  if (pct >= 60) return 'warning';
  return 'danger';
};

// Get performance badge
export const getPerformanceBadge = (score) => {
  if (score >= 75) return { label: 'Strong', cls: 'badge-success' };
  if (score >= 50) return { label: 'Average', cls: 'badge-warning' };
  return { label: 'Weak', cls: 'badge-danger' };
};

// Today's day name
export const todayName = () => {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long' });
};

// Current academic year e.g. 2025-2026
export const currentAcademicYear = () => {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}–${year + 1}`;
};
