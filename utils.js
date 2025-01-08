// utils.js
export const convertToTitleCase = (str) => {
  if (typeof str !== 'string') {
    return str; // Return the original value if it is not a string
  }
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const convertAllCapsToLowerCase = (str) => {
  return str.toLowerCase();
};

/**
 * Truncates a string to the specified length and adds ellipses if it exceeds that length.
 * @param {string} str - The string to truncate.
 * @param {number} num - The maximum length of the truncated string.
 * @return {string} - The truncated string.
 */
export function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}
export const insertLineBreaks = (str, sentencesPerBlock = 3, className = '') => {
  // Split the text into sentences using a more robust regex to handle sentence boundaries
  const sentences = str.match(/[^\.!\?]+[\.!\?]+/g) || [];

  // Capitalize the first letter of the first sentence and convert the rest to lowercase
  if (sentences.length > 0) {
    sentences[0] = sentences[0].charAt(0).toUpperCase() + sentences[0].slice(1).toLowerCase();
  }
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return `${date.toLocaleDateString()}`;
  };

  // Combine sentences and wrap them in <p> tags with Tailwind CSS classes
  const jsxElements = sentences.reduce((acc, sentence, index) => {
    if (index % sentencesPerBlock === 0) {
      acc.push(
        <p key={index} className={className}>
          {sentence.trim()}
        </p>
      );
    } else {
      acc[acc.length - 1] = (
        <p key={acc[acc.length - 1].key} className={className}>
          {acc[acc.length - 1].props.children} {sentence.trim()}
        </p>
      );
    }
    return acc;
  }, []);

  return jsxElements;
};