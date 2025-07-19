// Format date into a readable string
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Capitalize the first letter of a string
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text to a specified length
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Simple delay function (useful for simulating wait times in testing)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Scroll to top of the page
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
