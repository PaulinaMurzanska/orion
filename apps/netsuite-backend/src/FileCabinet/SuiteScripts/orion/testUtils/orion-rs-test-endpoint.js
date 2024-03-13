/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define([], function () {
  function handleGet(request) {
    return {
      body: 'SUCCESS: GET request received'
    }
  }

  function handlePost(request) {
    return {
      body: 'SUCCESS: POST request received'
    }
  }

  return {
    get: handleGet,
    post: handlePost
  }
})
