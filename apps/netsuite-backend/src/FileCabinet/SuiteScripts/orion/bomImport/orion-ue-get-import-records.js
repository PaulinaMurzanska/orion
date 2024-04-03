/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(['N/query', 'N/error'], (query, error) => {
  
  const get = async (context) => {
    const loggerTitle = 'get'

    let fieldString, valueString

    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)

    if (context.custrecord_bom_import_transaction) {
      fieldString = 'custrecord_bom_import_transaction'
      valueString = context.custrecord_bom_import_transaction
    } else if (context.custrecord_orion_bom_intialization_ident) {
      fieldString = 'custrecord_orion_bom_intialization_ident'
      valueString = context.custrecord_orion_bom_intialization_ident
    }

    log.debug(loggerTitle, `fieldString: ${fieldString}, valueString: ${valueString}`)

    const transactionID = context.custrecord_bom_import_transaction
    const initialRecordID = context.custrecord_orion_bom_intialization_ident
    
    // Create a SuiteQL query to find the custom record
    const findRecordsSuiteQL = `
      SELECT *
      FROM customrecord_orion_bom_import
      WHERE ${fieldString} = '${valueString}'
    `
    
    const results = await new Promise(resolve => { resolve(query.runSuiteQL({ query: findRecordsSuiteQL }).asMappedResults()) })

    log.debug(loggerTitle, `results: ${JSON.stringify(results)}`)

    if (results?.length > 0) {
      return { message: "SUCCESS: Import Records Found", bomRecs: results }
    } else {
      throw { message: "ERROR: No Import Records Found" }
    }
  }

  return {
    get: get
  }
})