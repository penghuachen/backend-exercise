const getQueries = (reqQuery, queriesSchema) => {
  return Object.keys(reqQuery).reduce((schema, queryKey) => {
    if (queriesSchema[queryKey]) {
      schema[queryKey] = queriesSchema[queryKey]
    }
    return schema;
  }, {});
};

module.exports = getQueries;