const generateId = () => {
  let id = Math.floor(100000 + Math.random() * 100000);
  return id;
};

export default generateId;
