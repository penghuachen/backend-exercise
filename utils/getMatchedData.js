const getMatchedData = async ({ db, page, size }) => {
  if (page < 1 || size < 1) return { data: [] };

  const { rows } = await db.findAndCountAll({
    limit: +size, // 每頁幾個
    offset: (page - 1) * size // 跳過幾個
  });
  return { data: rows };
}

module.exports = getMatchedData;