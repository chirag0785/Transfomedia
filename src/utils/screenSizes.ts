export const assignScreenSizes = ({ width }: { width: number }) => {
    if (width >= 900) {
      return 'max-w-7xl';  // For very large screens
    }
    if (width >= 600) {
      return 'max-w-2xl';  // For medium-large screens
    }
    if (width >= 400) {
      return 'max-w-xl';  // For smaller devices (up to 400px width)
    }
    return 'max-w-full';  // For very small devices, take up full width
  };
  