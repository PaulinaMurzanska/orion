/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record'], (record) => {
  let createdString

  const beforeLoad = async (context) => {
    if (context.type === context.UserEventType.CREATE) {
      await setBeforeDataValue(context)
    }
  }

  const afterSubmit = async (context) => {
    if (context.type === context.UserEventType.CREATE) {
      await setAfterDataValue(context)
    }
  }

  const setBeforeDataValue = (context) => {
    const currentRecord = context.newRecord
    const inlineHtmlField = currentRecord.getField({ fieldId: 'custpage_created_data_code_field' })

    createdString = generateRandomString(20)
    inlineHtmlField.defaultValue = `<span data-create-id="${createdString}"></span>`
  }

  const setAfterDataValue = (context) => {
    const currentRecord = context.newRecord
    const transactionID = currentRecord.id

  }

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters.charAt(randomIndex)
    }
    return result
  }

  return {
    beforeLoad: beforeLoad
  }
})