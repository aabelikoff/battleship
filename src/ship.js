const Ship = function (length) {
  let damages = 0;

  const hit = function () {
    if (damages < length) {
      damages += 1;
    }
  };

  const isSunc = () => {
    if (damages === length) {
      return true;
    }
    return false;
  };

  return {
    length,
    hit,
    isSunc,
  };
};

export default Ship;
