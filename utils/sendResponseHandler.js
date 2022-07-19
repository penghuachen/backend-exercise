const sendResponseHandler = (res, sendData) => {
  res.send({
    data: sendData
  })
  return;
};

module.exports = sendResponseHandler;