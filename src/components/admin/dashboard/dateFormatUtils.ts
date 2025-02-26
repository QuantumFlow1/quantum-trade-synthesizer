
// Format time for display
export const formatTime = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleTimeString();
  } catch (e) {
    console.error('Error formatting time:', e, dateString);
    return '';
  }
};

// Format date for tooltip
export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch (e) {
    console.error('Error formatting date:', e, dateString);
    return '';
  }
};
