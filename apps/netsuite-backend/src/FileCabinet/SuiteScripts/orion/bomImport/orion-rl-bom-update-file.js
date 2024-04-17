/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * FileCabinet/SuiteScripts/bom/rl-bom-create-file.js
 * File creation RESTlet for BOM Uploader tool
 *
 */
define(['N/file', 'N/runtime'], function (file, runtime) {
  const post = async context => {
    const loggerTitle = 'post'
    try {
      log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
      // Parse the incoming JSON data from the request body
      const requestData = context
      const folderLocation = runtime.getCurrentScript().getParameter({
        name: 'custscript_orion_bom_file_location'
      })

      const fileID = requestData.fileID

      // Create a new file
      let fileObj = file.load({ 
        id: fileID
      })

      fileObj.contents = requestData.fileContent

      // Save the file
      const fileID = fileObj.save()

      fileObj = file.load({
        id: fileID
      })

      const fileURL = fileObj.url

      // Log the fileId or do any further processing
      log.debug({
        title: 'File Updated',
        details: `File ID: ${fileID}`
      })

      // You can send a response if needed
      return ({
        output: {
          fileURL: fileURL,
          fileID: fileID
        }
      })
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
