/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 * @NAmdConfig /SuiteScripts/orion/orionModules.json
 */

define(['N/file', 'N/error', 'orion/json', 'orion/helper'], (file, error, orionJSONLib, orionHelperLib) => {
  /**
   * Function called upon sending a GET request to the RESTlet.
   *
   * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed as properties of this object.
   * @returns {Object|Array|String|Number|Boolean} - The response data.
   */
  const post = (context) => {
    const loggerTitle = 'get'

    try {
      log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
      const fileContent = context.fileContent
      const fileName = context.fileName

      // load definition files as JSON
      const fileDefs = orionHelperLib.loadDefinition('../fileDefinitions.json')
      const outDef = orionHelperLib.loadDefinition('../jsonOutputDefinition.json')

      // load number of lines we test on before failing failure matching on lines
      const failureLimit = fileDefs.failureLimit
      const fileDefinitions = fileDefs.fileDefinitions

      // get file type
      const fileType = orionJSONLib.getFileType(fileName)

      // filters out file defintions by type
      const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefinitions, fileType)
      let textLoops

      // returns the line text elements broken up by file type
      switch (fileType) {
        case 'sif':
          textLoops = orionJSONLib.findTextLoops(filteredFileDefs, fileContent, /([^\s].+)=/, null, 1)
          break
        case 'xml':
          textLoops = orionJSONLib.findTextLoops(filteredFileDefs, fileContent, /(<.+:|<)(.+)>.*(<|)/, '(<\/.+:|<)({var})>', 2)
          break
        default:
          return new Response({
            status: 400, // Bad Request
            body: {
              error: 'ERROR: File type not supported',
              details: 'Please include a file type of sif or xml in the file name.'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          })
      }

      // matches the file definitions by type
      const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)
      // generates the line JSON based on the file type
      const lineJSON = orionJSONLib.generateLineJSON(definition, textLoops, outDef, orionHelperLib)

      log.error(loggerTitle, `lineJSON: ${JSON.stringify(lineJSON)}`)


        return {
          message: 'SUCCESS: Lines have been generated',
          lineJSON: lineJSON
        }


    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  return {
    post: post
  }
})
