/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record'], (record) => {
  const afterSubmit = async (context) => {
    if (context.type === context.UserEventType.CREATE) {
      await updateImportRecordName(context)
    }
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
    afterSubmit: afterSubmit
  }
})