/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/query', 'N/ui/serverWidget'], (record, query, serverWidget) => {
  let createdString

  const beforeLoad = async (context) => {
    const loggerTitle = 'beforeLoad'
    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
    if (context.type === context.UserEventType.CREATE) {
      await setBeforeDataValue(context)
    }
  }

  const afterSubmit = async (context) => {
    if (context.type === context.UserEventType.CREATE) {
      await setAfterDataValue(context)
    }
  }

  /**
   * Sets the before data value for the given context.
   * @param {Object} context - The context object.
   * @returns {Promise<void>} - A Promise that resolves when the before data value is set.
   */
  const setBeforeDataValue = async (context) => {
    const loggerTitle = 'setBeforeDataValue'
    try {
      const form = context.form
      const inlineHtmlField = form.addField({
        id: 'custpage_created_data_code_field',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Created Data Code'
      })

      const createdString = generateRandomString(20)
      inlineHtmlField.defaultValue = `<span id="created-string-id" data-create-id="${createdString}"></span>`
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  /**
   * Sets the after data value for the given context.
   * 
   * @param {Object} context - The context object containing the new record.
   */
  const setAfterDataValue = async (context) => {
    const loggerTitle = 'setAfterDataValue'
    const currentRecord = context.newRecord
    const transactionID = currentRecord.id

    const getBOMRecordsQL = `
      SELECT id
      FROM customrecord_orion_bom_import
      WHERE custrecord_orion_bom_intializaiton_ident = '${createdString}'
    `

    const bomRecordsFound = await new Promise(resolve => { resolve(query.runSuiteQL(getBOMRecordsQL).asMappedResults()) })

    log.debug(loggerTitle, `bomRecordsFound: ${JSON.stringify(bomRecordsFound)}`)

    if (bomRecordsFound?.length > 0) {
      for (let bomRecord of bomRecordsFound) {
        const bomRecordID = bomRecord.id
        const bomRecordObj = record.load({
          type: 'customrecord_orion_bom_import',
          id: bomRecordID
        })

        bomRecordObj.setValue({
          fieldId: 'custrecord_bom_import_transaction',
          value: transactionID
        })

        bomRecordObj.save()
      }
    }
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
    beforeLoad: beforeLoad,
    afterSubmit: afterSubmit
  }
})