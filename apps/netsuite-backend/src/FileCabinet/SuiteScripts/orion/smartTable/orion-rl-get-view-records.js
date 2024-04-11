/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(['N/query', 'N/runtime', 'N/error'], (query, runtime, error) => {
  
  const get = async (context) => {
    const loggerTitle = 'get'

    let fieldString, valueString

    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)

    const currentUser = runtime.getCurrentUser()
    const role = currentUser.role

    log.debug(loggerTitle, `currentUser: ${JSON.stringify(currentUser)}, role: ${JSON.stringify(role)}`)
    
    // Create a SuiteQL query to find the custom record
    const findRecordsSuiteQL = `
      SELECT id
      FROM customrecord_orion_smarttable_view
      WHERE (BUILTIN.MNFILTER(custrecord_orion_smarttable_roles, 'MN_INCLUDE', '', 'FALSE', NULL, ${Number(role)}) = 'T' || custrecord_orion_smarttable_current_user = ${currentUser.id}) AND isinactive = 'F'
    `
    
    const results = await new Promise(resolve => { resolve(query.runSuiteQL({ query: findRecordsSuiteQL }).asMappedResults()) })

    log.debug(loggerTitle, `results: ${JSON.stringify(results)}`)

    if (results?.length > 0) {
      return { message: "SUCCESS: Import Records Found", tableViews: results }
    } else {
      throw { message: "ERROR: No Import Records Found" }
    }
  }

  return {
    get: get
  }
})