export const convertToTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};


// export const convertAllCapsToNormalCase = (str) => {
//   return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
// };
export const convertAllCapsToLowerCase = (str) => {
  return str.toLowerCase();
};


// export const processText = (str, sentencesPerLine = 3) => {
//   // Split the text into sentences
//   let sentences = str.split('.');

//   // Convert the first sentence to lowercase
//   if (sentences.length > 0) {
//     sentences[0] = sentences[0].toLowerCase();
//   }

//   // Combine sentences and add line breaks every few sentences
//   let processedText = sentences.reduce((acc, sentence, index) => {
//     if (index > 0 && index % sentencesPerLine === 0) {
//       return acc + '.\n' + sentence.trim();
//     }
//     return acc + '.' + sentence.trim();
//   }, '').trim();

//   // Ensure the text ends with a period if there were any sentences
//   if (sentences.length > 0) {
//     processedText += '.';
//   }

//   return processedText;
// };


export const insertLineBreaks = (str, sentencesPerBlock = 3, className = '') => {
  // Split the text into sentences using a more robust regex to handle sentence boundaries
  const sentences = str.match(/[^\.!\?]+[\.!\?]+/g) || [];

  // Capitalize the first letter of the first sentence and convert the rest to lowercase
  if (sentences.length > 0) {
    sentences[0] = sentences[0].charAt(0).toUpperCase() + sentences[0].slice(1).toLowerCase();
  }

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