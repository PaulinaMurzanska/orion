/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/file'], (record, file) => {
  const post = (context) => {
    const { recordID, recordType, fileID, sumColumns } = context

    // Load the record
    const recordWithLines = record.load({
      type: recordType,
      id: recordID
    })

    // Load the file
    const fileObj = file.load({
      id: fileID
    })

    // Get the totals from the file
    const fileContents = fileObj.getContents()
    let lineObj

    if (fileContents?.length > 0) {
      const fileContentsJSON = JSON.parse(fileContents)
      const sumTotals = getSumFromObjects(fileContentsJSON, sumColumns)

      // Get the line count of the item sublist
      const lineCount = myRecord.getLineCount({
        sublistId: 'item'
      })

      if (lineCount === 0) {
        // Create a new line
        recordWithLines.insertLine({
          sublistId: 'item',
          line: 0
        })
      }

      // Update the record with the totals
      recordWithLines.setSublistValue({
        sublistId: 'item',
        fieldId: 'item',
        value: 8, // Generic Item internal ID - CHANGEME
        line: 0
      })


      // Update the record with the totals
      recordWithLines.setSublistValue({
        sublistId: 'item',
        fieldId: 'quantity',
        value: 1,
        line: 0
      })

      // Update the record with the totals
      recordWithLines.setValue({
        fieldId: 'description',
        value: 'Totals',
        line: 0
      })

      // Save the record
      recordWithLines.save()
    }
  }

    return {
      recordId: savedRecordId
    }
  }

  /**
   * Calculates the sum of specified fields from an array of objects.
   *
   * @param {Object[]} objects - The array of objects to calculate the sum from.
   * @param {string[]} fields - The fields to calculate the sum for.
   * @returns {Object} - An object containing the sum of each field.
   */
  const getSumFromObjects = (objects, fields) => {
    if (!objects || !fields) {
      return null
    }

    let fieldSums = {}
 
    objects.forEach(obj => {
      fields.forEach(field => {
        fieldSums[field] += Number(obj[field]) || 0
      })
    })

    return fieldSums
  }

  return {
    post: post
  }
})
