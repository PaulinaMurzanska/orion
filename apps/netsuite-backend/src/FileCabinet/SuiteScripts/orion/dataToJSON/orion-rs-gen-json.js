/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 * @NAmdConfig /SuiteScripts/orion/orionModules.json
 */

define(['N/file', 'orion/json', 'orion/helper'], (file, orionJSONLib, orionHelperLib) => {
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
        default:
          return { message: "ERROR: File type not supported" }
      }

      // matches the file definitions by type
      const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)
      // generates the line JSON based on the file type
      const lineJSON = orionJSONLib.generateLineJSON(definition, textLoops, outDef, orionHelperLib)

      return { message: "SUCCESS: Lines have been generated", lineJSON: lineJSON }

    } catch (e) {
      log.error({ title: loggerTitle, details: e })
      return { message: `ERROR: ${e}` }
    }
  }

  return {
    post: post
  }
})
