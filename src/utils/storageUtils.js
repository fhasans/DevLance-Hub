export const getLocalStorageUsage = () => {
  try {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2); // 2 bytes per character in UTF-16
      }
    }
    const totalKB = (total / 1024).toFixed(2);
    const maxKB = 5120; // 5MB = 5 * 1024
    const percentage = ((totalKB / maxKB) * 100).toFixed(1);
    
    return {
      usedKB: parseFloat(totalKB),
      maxKB: maxKB,
      percentage: parseFloat(percentage),
      isNearLimit: percentage > 80
    };
  } catch (e) {
    console.error("Failed to calculate localStorage usage:", e);
    return { usedKB: 0, maxKB: 5120, percentage: 0, isNearLimit: false };
  }
};
