/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/query', 'N/ui/serverWidget'], (record, query, serverWidget) => {

  const beforeLoad = async (context) => {
    const loggerTitle = 'beforeLoad'
    try {
      log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
      if (context.type === context.UserEventType.CREATE) {
        await setBeforeDataValue(context)
      }
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  const afterSubmit = async (context) => {
    const loggerTitle = 'afterSubmit'
    try {
      if (context.type === context.UserEventType.CREATE) {
        await setAfterDataValue(context)
      }
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
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
      // Add inline HTML field in the form with a value the front end can access
      const inlineHtmlField = form.addField({
        id: 'custpage_created_data_code_field',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Created Data Code HTML'
      })
      // Add freeform text field in the form to be accessed later on
      const freeformTextField = form.addField({
        id: 'custpage_created_data_code_field_text',
        type: serverWidget.FieldType.TEXT,
        label: 'Created Data Code'
      })

      // make field hidden
      freeformTextField.updateDisplayType({
        displayType : serverWidget.FieldDisplayType.HIDDEN
      })
      // generate random string
      const createdString = generateRandomString(20)
      // write the random string to the inline HTML field
      inlineHtmlField.defaultValue = `<span id="created-string-id" data-create-id="${createdString}"></span>`
      // write the random string to the freeform text field to be accessed after submit
      freeformTextField.defaultValue = createdString
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

    try {
      const currentRecord = context.newRecord
      const transactionID = currentRecord.id

      // get the created string from the freeform text field
      const createdString = currentRecord.getValue('custpage_created_data_code_field_text')

      // query for the BOM records that have the created string
      const getBOMRecordsQL = `
        SELECT id
        FROM customrecord_orion_bom_import
        WHERE custrecord_orion_bom_intializaiton_ident = '${createdString}'
      `

      log.debug(loggerTitle, `createdString: ${createdString}`)

      // get the BOM records that have the created string
      const bomRecordsFound = await new Promise(resolve => { resolve(query.runSuiteQL(getBOMRecordsQL).asMappedResults()) })

      log.debug(loggerTitle, `bomRecordsFound: ${JSON.stringify(bomRecordsFound)}`)

      // if BOM records are found, update the BOM records with the transaction ID and remove the created string
      if (bomRecordsFound?.length > 0) {
        for (let bomRecord of bomRecordsFound) {
          const bomRecordID = bomRecord.id

          const bomResultRecordID = await record.submitFields.promise({
            type: 'customrecord_orion_bom_import',
            id: bomRecordID,
            values: {
              custrecord_bom_import_transaction: transactionID,
              custrecord_orion_bom_intializaiton_ident: null
            }
          })
        }
      }
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  /**
   * Generates a random string of the specified length.
   *
   * @param {number} length - The length of the random string to generate.
   * @returns {string} The randomly generated string.
   */
  const generateRandomString = (length) => {
    loggerTitle = 'generateRandomString'

    try {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
      }
      return result
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }

    return null
  }

  return {
    beforeLoad: beforeLoad,
    afterSubmit: afterSubmit
  }
})