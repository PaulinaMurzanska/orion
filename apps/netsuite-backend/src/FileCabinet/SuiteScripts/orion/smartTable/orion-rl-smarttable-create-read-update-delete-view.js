/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * FileCabinet/SuiteScripts/bom/rl-bom-create-file.js
 * File creation RESTlet for BOM Uploader tool
 *
 */

define(['N/record', `N/query`], function (record, query) {
  const get = async context => {
    const loggerTitle = 'get'
        
    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
    const smartTableRecordID = context.smartTableRecordID
    const suiteQL = `SELECT * FROM customrecord_orion_smarttable_view WHERE id = ${smartTableRecordID}`
    const queryResults = new Promise(resolve => { resolve(query.runSuiteQL({query: suiteQL}).asMappedResults()) })

    return queryResults
  }

  const post = async context => {
    const loggerTitle = 'post'
    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
    const action = context.action
    const editID = context.editID
    const smartTableViewValues = context
    // {
    //   action: "create",
    //   custrecord_orion_smarttable_view_type: 1, // 1 = Default, 2 = User Curated, 3 = Summary
    //   custrecord_orion_view_json: "{}",
    //   custrecord_orion_smarttable_icon: 1,
    //   custrecord_orion_smarttable_position: 2,
    //   custrecord_orion_smarttable_roles: [1, 2],
    //   custrecord_orion_smarttable_current_user: 1,
    // }

    const recordID = await createCustomRecord(action, smartTableViewValues, editID)

    return {
      smartTableViewID: recordID
    }
  }

  const deleteReq = async context => {
    const loggerTitle = 'delete'
    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
    const recordID = context.smartTableRecordID
    const recordType = 'customrecord_orion_smarttable_view'
    const deleteRecord = await record.delete.promise({
      type: recordType,
      id: recordID
    })

    return {
      smartTableViewID: recordID
    }
  }
  

  /**
   * Creates or edits a custom record based on the provided action and values.
   * @param {string} action - The action to perform. Possible values are 'create' or 'edit'.
   * @param {Object} smartTableValues - The values to set for the custom record.
   * @returns {Object} - An object containing the error message if an error occurs, otherwise undefined.
   */
  const createCustomRecord = async (action, smartTableValues, editID) => {
    const loggerTitle = 'createCustomRecord'
    try {
      let smartTableID
      switch (action) {
        case 'create':
          const customRecord = await record.create.promise({
            type: 'customrecord_orion_smarttable_view'
          })

          customRecord.setValue({
            fieldId: 'name',
            value: 'Intiated BoM Import'
          })

          // set field values
          for (let key in smartTableValues) {
            customRecord.setValue({
              fieldId: key,
              value: smartTableValues[key]
            })
          }

          // save values
          smartTableID = await customRecord.save.promise()
          break
        case 'edit':
          // update values
          smartTableID = await record.submitFields.promise({
            type: 'customrecord_orion_smarttable_view',
            id: editID,
            values: smartTableValues
          })
          break
      }

      return smartTableID

    } catch (e) {
      const errorString = e.toString()
      // handle errors
      log.error({
        title: loggerTitle,
        details: `Error: ${errorString}`
      })

      return ({
        error: `Error: ${errorString}`
      })
    }
  }

  return {
    get: get,
    post: post,
    delete: deleteReq
  }
})
