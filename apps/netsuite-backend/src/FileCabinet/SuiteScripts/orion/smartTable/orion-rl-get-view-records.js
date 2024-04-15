/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(['N/query', 'N/runtime', 'N/error'], (query, runtime, error) => {
  
  const get = (context) => {
    const loggerTitle = 'get'

    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)

    const currentUser = runtime.getCurrentUser()
    const currentRole = currentUser.role

    log.debug(loggerTitle, `currentUser: ${currentUser}, role: ${currentRole}`)
    
    // Create a SuiteQL query to find the custom record
    const findRecordsSuiteQL = `
      SELECT *
      FROM customrecord_orion_smarttable_view
      WHERE (BUILTIN.MNFILTER(custrecord_orion_smarttable_roles, 'MN_INCLUDE', '', 'FALSE', NULL, ${Number(currentRole)}) = 'T' OR custrecord_orion_smarttable_current_user = ${currentUser.id}) AND isinactive = 'F'
    `

    log.debug(loggerTitle, `findRecordsSuiteQL: ${findRecordsSuiteQL}`)
    
    const results = query.runSuiteQL({ query: findRecordsSuiteQL }).asMappedResults()

    log.debug(loggerTitle, `results: ${JSON.stringify(results)}`)

    if (results?.length > 0) {
      return { message: "SUCCESS: Import Records Found", tableViews: results }
    } else {
      throw error.create({
        name: 'ORION_NO_VIEW_RECORDS_FOUND',
        message: 'No view Records Found',
        notifyOff: false
      })
    }
  }

  return {
    get: get
  }
})