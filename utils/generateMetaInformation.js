const generateMetaInformation = ({  total, page, size }) => {
  if (page < 1 || size < 1) {
    return {
      meta: {
        page: 0,
        size: 0,
        from: 0,
        to: 0,
        total,
      }
    }

  }

  return {
    meta: {
      page: +page,
      size: +size,
      from: (page - 1) * size + 1,
      to: page * size,
      total,
    }
  }
}

module.exports = generateMetaInformation;