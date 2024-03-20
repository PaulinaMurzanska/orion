/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * FileCabinet/SuiteScripts/bom/rl-bom-create-file.js
 * File creation RESTlet for BOM Uploader tool
 *
 * Version    Date            Author          Remarks
 * 0.1        23.12.01                        Initial version with hardcoded values.
 */
define(['N/file'], function (file) {
  const post = async context => {
    const loggerTitle = 'post'
    try {
      log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
      // Parse the incoming JSON data from the request body
      const requestData = context

      // Create a new file
      let fileObj = file.create({
        name: requestData.fileName,
        fileType: file.Type.PLAINTEXT,
        contents: requestData.fileContent,
        description: 'File created from BOM Uploader tool',
        folder: 21,
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
          fileURL: fileURL
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
    post
  }
})
