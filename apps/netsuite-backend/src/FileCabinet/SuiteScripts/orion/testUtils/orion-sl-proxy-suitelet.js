/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/url', 'N/runtime'], function (https, url, runtime) {
  /**
   * Handles the incoming request.
   * 
   * @param {Object} context - The context object containing the request details.
   * @returns {Promise<void>} - A promise that resolves when the request is handled.
   */
  const onRequest = async (context) => {
    const loggerTitle = 'onRequest'
    try {
      log.debug(loggerTitle, `Request method: ${JSON.stringify(context)}`)
      log.debug(loggerTitle, `context.request.body: ${JSON.stringify(context.request.body)}`)
      // only works for post and get requests
      if (context.request.method === 'POST' || context.request.method === 'GET') {
        log.debug(loggerTitle, 'Entered conditional')
        // include headers
        var headers = {
          'Content-Type': 'application/json' // Replace with the appropriate content type
        }
        
        var response
        switch (context.request.method) {
          case 'POST':
            // if post request, get the scriptID and deploymentID from the request body
            var scriptID = JSON.parse(context.request.body).scriptID // Replace with your script ID
            var deploymentID = JSON.parse(context.request.body).deploymentID // Replace with your deployment ID
            // call the restlet
            response = await https.requestRestlet.promise({
              scriptId: scriptID,
              deploymentId: deploymentID,
              method: context.request.method,
              headers: headers,
              external: true,
              body: context.request.body
            })
            break
          case 'GET':
            // if get request, get the scriptID and deploymentID from the request parameters
            var scriptID = context.request.parameters.scriptID // Replace with your script ID
            var deploymentID = context.request.parameters.deploymentID // Replace with your deployment ID
            // call the restlet
            response = await https.requestRestlet.promise({
              scriptId: scriptID,
              deploymentId: deploymentID,
              method: context.request.method,
              headers: headers,
              external: true,
              urlParams: context.request.parameters
            })
            break
        }

        log.debug(loggerTitle, `context.request: ${JSON.stringify(context.request)}`)
        log.debug(loggerTitle, `response.body: ${response.body}`)

        context.response.write(`${response.body}`)
      } else {
        context.response.write(`ERROR: Invalid request method`)
      }
    } catch (e) {
      log.error(loggerTitle, `ERROR: ${e}`)
      context.response.write('ERROR: ' + e)
    }
  }

  return {
    onRequest: onRequest
  }
})
