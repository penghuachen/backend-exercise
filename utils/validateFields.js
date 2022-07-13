const validateFields = (schema, body) => {
    const { error: errors, value } = schema.validate(
        body,
        { abortEarly: false }
    );

    return errors?.details?.reduce((obj, error) => {
        for (const objKey in value) {
            if (error.message.includes(objKey)) {
                obj[objKey] = {
                    messages: [error.message],
                    field: objKey
                }
            }
        }
        return obj;
    }, {});
}

module.exports = validateFields