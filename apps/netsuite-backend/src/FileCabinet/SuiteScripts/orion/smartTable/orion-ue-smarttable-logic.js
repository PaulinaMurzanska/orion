/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url'], (record, url) => {
  const afterSubmit = context => {
    if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
      switch (context.newRecord.type) {
        case 'customrecord_orion_smarttable':
          setURLField(context)
          break
      }
    }
  }

  const setURLField = context => {
    const newRecord = context.newRecord
    const oldRecord = context.oldRecord ? context.oldRecord : null

    // Check if the field has changed
    if (!oldRecord || newRecord.getValue('	custrecord_orion_smarttable_icon') !== oldRecord.getValue('	custrecord_orion_smarttable_icon')) {
      var fileId = newRecord.getValue('	custrecord_orion_smarttable_icon')

      // Get the file URL
      var fileUrl = url.resolveRecord({
        recordType: url.Type.FILE,
        recordId: fileId,
        isEditMode: false
      })

      // Update the URL field
      newRecord.setValue('custrecord_orion_smarttable_icon', fileUrl)
    }
  }

  return {
    afterSubmit: afterSubmit
  }
})