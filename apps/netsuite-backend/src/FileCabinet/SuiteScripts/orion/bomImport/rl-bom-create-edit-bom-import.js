/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * FileCabinet/SuiteScripts/bom/rl-bom-create-file.js
 * File creation RESTlet for BOM Uploader tool
 *
 */

define(['N/record'], function (record) {
  const post = async context => {
    const loggerTitle = 'post'
    try {
      log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
      const action = context.action
      const editID = context.editID
      const bomImportValues = context.importValues
      // {
      //   custrecord_bom_import_importd_file_url: '/core/media/media.nl?id=199&c=2584332&h=aekfP4cHu3Hsb2QE-uvqstpt-shVUivg0EtyoPI_d4KbXE5V&mv=ltj3t6yo&_xt=.txt',
      //   custrecord_bom_import_json_importd_file: '/core/media/media.nl?id=199&c=2584332&h=aekfP4cHu3Hsb2QE-uvqstpt-shVUivg0EtyoPI_d4KbXE5V&mv=ltj3t6yo&_xt=.txt',
      //   custrecord_bom_import_file_import_order: 1,
      //   custrecord_bom_import_transaction: 123456,
      //   custrecord_orion_bom_intialization_ident: 'GmOBKvsQkQ4R3U2N'
      // }

      await createCustomRecord(action, bomImportValues )

    } catch (e) {
      const errorString = e.toString()
      // Handle errors
      log.error({
        title: loggerTitle,
        details: `Error: ${errorString}`
      })

      return ({
        error: `Error: ${errorString}`
      })
    }
  }

  /**
   * Creates or edits a custom record based on the provided action and values.
   * @param {string} action - The action to perform. Possible values are 'create' or 'edit'.
   * @param {Object} bomImportValues - The values to set for the custom record.
   * @returns {Object} - An object containing the error message if an error occurs, otherwise undefined.
   */
  const createCustomRecord = async (action, bomImportValues, editID) => {
    const loggerTitle = 'createCustomRecord'
    try {
      let bomImportID
      switch (action) {
        case 'create':
          const customRecord = record.create({
            type: 'customrecord_bom_import'
          })

          // set field values
          for (let key in bomImportValues) {
            customRecord.setValue({
              fieldId: key,
              value: bomImportValues[key]
            })
          }

          // save values
          bomImportID = customRecord.save()
          break
        case 'edit':
          // update values
          bomImportID = record.submitFields({
            type: 'customrecord_bom_import',
            id: editID,
            values: bomImportValues
          })
          break
      }

    } catch (e) {
      const errorString = e.toString()
      // Handle errors
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
    post: post
  }
})
