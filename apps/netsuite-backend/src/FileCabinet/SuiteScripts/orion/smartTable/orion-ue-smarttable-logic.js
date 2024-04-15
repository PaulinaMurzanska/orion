/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/file'], (record, file) => {
  const afterSubmit = context => {
    if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
      switch (context.newRecord.type) {
        case 'customrecord_orion_smarttable_view':
          setURLField(context)
          break
      }
    }
  }

  const setURLField = context => {
    const loggerTitle = 'setURLField'
    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
    const newRecord = context.newRecord
    const oldRecord = context.oldRecord ? context.oldRecord : null

    // Check if the field has changed
    if (!oldRecord || newRecord.getValue('custrecord_orion_smarttable_icon') !== oldRecord.getValue('custrecord_orion_smarttable_icon')) {
      var fileID = newRecord.getValue('custrecord_orion_smarttable_icon')

      // Get the file URL
      var fileObj = file.load({
        id: fileID
      })

      var fileUrl = fileObj.url

      record.submitFields({
        type: newRecord.type,
        id: newRecord.id,
        values: {
          custrecord_orion_smarttable_icon_url: fileUrl
        }
      })
    }
  }

  return {
    afterSubmit: afterSubmit
  }
})