const generateId = () => {
  let id = Math.floor(100000 + Math.random() * 100000);
  return String(id);
};

export default generateId;
