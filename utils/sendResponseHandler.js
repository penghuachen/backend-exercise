const sendResponseHandler = (res, sendData) => {
  res.send({
    data: { ...sendData }
  })
};

module.exports = sendResponseHandler;