/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record'], (record) => {
  let createdString

  const beforeLoad = async (context) => {
    const loggerTitle = 'beforeLoad'
    try {
      if (context.type === context.UserEventType.CREATE) {
        switch (context.newRecord.type) {
          case 'salesorder':
            await setBeforeDataValue(context)
            break
        }
      }
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  const afterSubmit = async (context) => {
    const loggerTitle = 'afterSubmit'
    try {
      if (context.type === context.UserEventType.CREATE) {
        switch (context.newRecord.type) {
          case 'customrecord_orion_bom_import':
            await updateImportRecordName(context)
            break
          case 'salesorder':
            await setAfterDataValue(context)
            break
        }
      }
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  /**
   * Sets the before data value for the given context.
   *
   * @param {Object} context - The context object.
   * @param {Object} context.newRecord - The new record object.
   */
  const setBeforeDataValue = (context) => {
    const currentRecord = context.newRecord
    const inlineHtmlField = currentRecord.getField({ fieldId: 'custpage_created_data_code_field' })

    createdString = generateRandomString(20)
    inlineHtmlField.defaultValue = `<span data-create-id="${createdString}"></span>`
  }

  /**
   * Sets the after data value for the given context.
   *
   * @param {Object} context - The context object.
   * @param {Object} context.newRecord - The new record object.
   * @param {string} context.newRecord.id - The ID of the current record.
   * @returns {void}
   */
  const setAfterDataValue = (context) => {
    const currentRecord = context.newRecord
    const transactionID = currentRecord.id
  }

  /**
   * Generates a random string of the specified length.
   *
   * @param {number} length - The length of the random string to generate.
   * @returns {string} The randomly generated string.
   */
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters.charAt(randomIndex)
    }
    return result
  }

  /**
   * Updates the name value of a custom record based on the provided context.
   *
   * @param {Object} context - The context object containing the new record.
   * @param {Object} context.newRecord - The new record object.
   * @param {string} context.newRecord.id - The ID of the new record.
   * @returns {Promise<void>} - A promise that resolves when the name value is updated.
   */
  const updateImportRecordName = async (context) => {
    const newRecord = context.newRecord
    const recordId = newRecord.id
    
    // Update the name value of the custom record
    const recordID = await record.submitFields.promise({
      type: 'customrecord_orion_bom_import',
      id: recordId,
      values: {
        name: `BOM-${recordId}`
      }
    })
  }

  return {
    beforeLoad: beforeLoad,
    afterSubmit: afterSubmit
  }
})