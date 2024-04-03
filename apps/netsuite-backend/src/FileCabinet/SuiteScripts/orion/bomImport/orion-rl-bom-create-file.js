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

      // Create a new file
      let fileObj = file.create({
        name: requestData.fileName,
        fileType: file.Type.PLAINTEXT,
        contents: requestData.fileContent,
        description: 'File created from BOM Uploader tool',
        folder: folderLocation,
        isOnline: true
      })

      // Save the file
      const fileID = fileObj.save()

      fileObj = file.load({
        id: fileID
      })

      const fileURL = fileObj.url

      // Log the fileId or do any further processing
      log.debug({
        title: 'File Created',
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
