const toSentenceCase = (str: string): string => {
  let newString = str.toLowerCase();

  newString = newString.charAt(0).toUpperCase() + newString.slice(1);

  return newString;
};

export default toSentenceCase;
