/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */

define(['N/log', 'N/query', 'N/xml', 'N/file'], function (log, query, xml, file) {

  /**
   * Finds the ID by a specified field in the given file definition.
   * 
   * @param {Object} fileDef - The file definition object.
   * @param {string} field - The field to search for in the file definition.
   * @param {string} lookupVar - The value to lookup in the specified field.
   * @returns {string|null} - The ID if found, otherwise null.
   */
  const findIDByField = (fileDef, itemList, newOutputDefKeysLoop) => {
    const loggerTitle = 'findIDByField'
    try {
      let whereString = ''
      let whereKeyResults = {}
      let lineLimit = 250

      const idMaps = fileDef.id_maps

      // for each key in "id_maps" definition generate a where string
      for (let idMapKey in idMaps) {
        whereKeyResults[idMapKey] = []
        if (itemList[idMapKey]) {
          for (let [idx, itemObj] of itemList[idMapKey].entries()) {
            const keyResults = itemObj
            // if we are not on the first item and the where string does not end with "OR" add "OR" to the end of the string
            if (idx > 0 && !/OR\s$/.test(whereString)) {
              whereString += ' OR '
            }
            // build the where string
            let returnedString = buildWhereString(idMapKey, idMaps[idMapKey], keyResults, newOutputDefKeysLoop, whereString, fileDef)
            
            // add the where string to the whereKeyResults object if it doeesn't already exist in string
            whereString += whereString.indexOf(returnedString) === -1 ? returnedString : ''
            
            // if we are at the line limit or the last item in the list add the where string to the whereKeyResults object and reset the where string
            if (idx === lineLimit - 1 || idx === itemList[idMapKey].length - 1) {
              whereKeyResults[idMapKey] = whereKeyResults[idMapKey].concat([whereString])
              whereString = ''
            }
          }
        }
      }

      whereKeyResults = buildHeaderString(idMaps, whereKeyResults)
      const searchResults = getSQLResults(whereKeyResults)
      newOutputDefKeysLoop = addResultsToOutput(searchResults, newOutputDefKeysLoop, idMaps)

      log.debug(loggerTitle, `newOutputDefKeysLoop: ${JSON.stringify(newOutputDefKeysLoop)}`)
      return newOutputDefKeysLoop

    } catch (e) {
      log.error(loggerTitle, e)
      const fileObj = file.create({ name: 'error.txt', fileType: file.Type.PLAINTEXT, contents: JSON.stringify(e), folder: 104})
      fileObj.save()

    }

  }

  /**
   * Builds a WHERE string based on the provided parameters.
   *
   * @param {string} idMapKey - The key for the ID map.
   * @param {Object} idMaps - The ID maps object.
   * @param {Object} keyResults - The key results object.
   * @param {Array} newOutputDefKeysLoop - The new output definition keys loop array.
   * @param {string} whereString - The initial WHERE string.
   * @returns {string} The built WHERE string.
   */
  const buildWhereString = (idMapKey, idMaps, keyResults, newOutputDefKeysLoop, whereString, fileDef) => {
    const loggerTitle = 'buildWhereString'

    try {
      let fields = idMaps.field
      let whereStringBlock = '('

      log.debug(loggerTitle, `fields: ${JSON.stringify(fields)}`)
      // for each field in the "field" array of the "id_maps" definition generate a where string block
      for (let [idx, field] of fields.entries()) {
        // if we are not on the first item add in between the fields
        if (idx > 0 && !/\($/.test(whereStringBlock)) {
          whereStringBlock += ` ${idMaps.field_join} `
        }
        // if the field is not a mapped field use the keyResults value, otherwise use the mapped field value
        if (!idMaps.map_field) {
          keyResults.value = keyResults.value.replace(/'/g, "''").replace(/"/g, '""')
          // if the value is a service value use SOUNDEX, otherwise use the value
          whereStringBlock += isServiceValue(keyResults.value, newOutputDefKeysLoop[keyResults.idx], fileDef) && field.soundex ? `(SOUNDEX(${field.field}) = SOUNDEX('${keyResults.value}'))` : `(${field.field} = '${keyResults.value}')`
        } else {
          // if the value is a service value use SOUNDEX, otherwise use the value
          let fieldValue = newOutputDefKeysLoop[keyResults.idx][idMaps.map_field[idx]]
          if (fieldValue) {
            fieldValue = fieldValue.replace(/'/g, "''").replace(/"/g, '""')
            whereStringBlock += isServiceValue(fieldValue, newOutputDefKeysLoop[keyResults.idx], fileDef) && field.soundex ? `(SOUNDEX(${field.field}) = SOUNDEX('${fieldValue}'))` : `(${field.field} = '${fieldValue}')`
          }  
        }
      }
      whereStringBlock += ')'

      return whereStringBlock
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Builds the header string for querying data based on the provided idMaps and whereKeyResults.
   *
   * @param {Object} idMaps - The idMaps object containing the mapping information.
   * @param {Object} whereKeyResults - The whereKeyResults object containing the query results.
   * @returns {Object} - The modified whereKeyResults object.
   */
  const buildHeaderString = (idMaps, whereKeyResults) => {
    const loggerTitle = 'buildHeaderString'
    // for each key in the "id_maps" definition generate a header string
    for (let idMapKey in idMaps) {
      // build the header string
      let headerString = `SELECT ${idMaps[idMapKey].return_field}, ${fieldsToString(idMaps[idMapKey].field)} FROM ${idMaps[idMapKey].type} WHERE `

      // for each where string in the whereKeyResults object add the header string to the beginning of the where string
      for (let [idx, whereResults] of whereKeyResults[idMapKey].entries()) {
        // removed OR string from beginning or end
        let fullString = headerString + whereResults.replace(/^\s+OR\s/, '')
        whereKeyResults[idMapKey][idx] = (fullString.replace(/\sOR\s$/, ''))
      }
    }

    return whereKeyResults
  }

  /**
   * Retrieves SQL results based on the provided where key results.
   *
   * @param {Object} whereKeyResults - The where key results object.
   * @returns {Object} - The result values object.
   */
  const getSQLResults = (whereKeyResults) => {
    const loggerTitle = 'getSQLResults'
    let resultValues = {}
    log.debug(loggerTitle, `whereKeyResults: ${JSON.stringify(whereKeyResults)}`)
    // for each key in the whereKeyResults object run the query and add the results to the resultValues object
    for (let idMapKey in whereKeyResults) {
      let combinedResults = []
      log.debug(loggerTitle, `idMapKey: ${idMapKey}`)
      // for each where string in the whereKeyResults object run the query and add the results to the combinedResults array
      for (let [idx, whereResult] of whereKeyResults[idMapKey].entries()) {
        log.debug(loggerTitle, `whereResult: ${whereResult}`)
        let queryResults = query.runSuiteQL({ query: whereResult })
        let results = queryResults.asMappedResults()
        combinedResults = combinedResults.concat(results)
      }
      resultValues[idMapKey] = combinedResults
    }

    return resultValues
  }


  /**
   * Adds results to the output based on the provided parameters.
   *
   * @param {Array} resultValues - The result values.
   * @param {Array} newOutputDefKeysLoop - The loop of new output definition keys.
   * @param {Object} idMaps - The ID maps.
   * @returns {Array} - The updated newOutputDefKeysLoop array.
   */
  const addResultsToOutput = (resultValues, newOutputDefKeysLoop, idMaps) => {
    const loggerTitle = 'addResultsToOutput'

    try {
      // for each key in the newOutputDefKeysLoop array add the results to the newOutputDefKeysLoop array
      for (let [idx, newOutputDefKeys] of newOutputDefKeysLoop.entries()) {
        for (let idMapKey in idMaps) {
          const toResults = []

          // for each field in the "map_field" array of the "id_maps" definition add the results to the toResults array
          if (idMaps[idMapKey].map_field?.length > 0) {
            // for each field in the "map_field" array of the "id_maps" definition add the results to the toResults array
            for (let [keyIdx, field] of idMaps[idMapKey].map_field.entries()) {
              toResults.push({
                key_idx: keyIdx,
                key: field,
                value: newOutputDefKeys[field]
              })
            }
            // find the result output based on the toResults and resultValues
            let foundResult = findResultOutput(toResults, resultValues, idMaps[idMapKey], idMapKey)
            log.debug(loggerTitle, `foundResult: ${JSON.stringify(foundResult)}`)
            // if a result is found add the result to the newOutputDefKeysLoop array
            if (foundResult) {
              let resultField = foundResult.return_key
              let resultObj = resultField ? {id: resultField} : null
              log.debug(loggerTitle, `resultObj: ${JSON.stringify(resultObj)}`)
              log.debug(loggerTitle, `idMapKey: ${idMapKey}`)
              newOutputDefKeysLoop[idx][idMapKey] = resultObj ? resultObj : null
              log.debug(loggerTitle, `newOutputDefKeysLoop[idx][idMapKey]: ${JSON.stringify(newOutputDefKeysLoop[idx][idMapKey])}`)
            } else {
              newOutputDefKeysLoop[idx][idMapKey] = null
            }
          }
        }
      }
      log.debug(loggerTitle, `newOutputDefKeysLoop: ${JSON.stringify(newOutputDefKeysLoop)}`)
      return newOutputDefKeysLoop
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Finds the result output based on the provided parameters.
   *
   * @param {Array} toResults - The array of results to search from.
   * @param {Object} searchResults - The search results object.
   * @param {Object} idMap - The mapping object containing field and return field information.
   * @param {string} idMapKey - The key to access the search result in the idMap object.
   * @returns {Object|null} - The found result entry or null if not found.
   */
  const findResultOutput = (toResults, searchResults, idMap, idMapKey) => {
    const loggerTitle = 'findResultOutput'

    try {
      const searchResult = searchResults[idMapKey]

      let fromResults = []
      let soundexStrings = []
      // for each field in the "field" array of the "id_maps" definition add the results to the fromResults array
      for (let [idx, field] of idMap.field.entries()) {
        for (let searchField of searchResult) {
          // log.debug(loggerTitle, `searchField: ${JSON.stringify(searchField)}`)
          if (searchField[field.field]) {
            fromResults.push({
              key_idx: idx,
              return_key: searchField[idMap.return_field],
              key: field.field,
              value: searchField[field.field]
            })
            soundexStrings.push(field.soundex)
          }
        }
      }

      // filter out null values from the toResults array
      toResults = toResults.filter(toResult => {
        return toResult.value !== null
      })

      log.debug(loggerTitle, `toResults: ${JSON.stringify(toResults)}`)
      log.debug(loggerTitle, `fromResults: ${JSON.stringify(fromResults)}`)
      let foundEntries = []

      // for each result in the toResults array find the result in the fromResults array
      for (let [idx, toResult] of toResults.entries()) {
        for (let [forIdx, fromResult] of fromResults.entries()) {
          
          // if the value and key index match add the return key to the toResult and add the toResult to the foundEntries array
          if ((toResult.value === fromResult.value || (soundexStrings[forIdx] && soundex(fromResult.value) === soundex(toResult.value))) && toResult.key_idx === fromResult.key_idx) {
            log.debug(loggerTitle, `fromResult: ${JSON.stringify(fromResult)}`)
            log.debug(loggerTitle, `toResult: ${JSON.stringify(toResult)}`)
            toResult.return_key = fromResult.return_key
            foundEntries.push(toResult)
            break
          }
        }

        // if the index is the last index in the toResults array and the foundEntries array length is equal to the toResults array length return the toResult, otherwise return null
        if (idx === toResults.length - 1) {
          log.debug(loggerTitle, `foundEntries: ${JSON.stringify(foundEntries)}`)
          return foundEntries.length === toResults.length ? toResult : null
        }
      }
    } catch (e) {
      log.error(loggerTitle, e)
    } 

  }

  /**
   * Calculates the Soundex code for a given word.
   *
   * @param {string} word - The word to calculate the Soundex code for.
   * @returns {string} The Soundex code for the given word.
   */
  const soundex = (word) => {
    // Convert the word to uppercase
    word = word.toUpperCase()

    // Remove non-alphabetic characters
    word = word.replace(/[^A-Z]/g, '')

    // Handle special cases for initial letters
    if (word.length > 0) {
      const firstLetter = word[0]
      word = word.substring(1).replace(/[AEIOUYHW]/g, '')
      word = firstLetter + word
    }

    // Replace consonants with digits
    word = word.replace(/[BFPV]/g, '1')
    word = word.replace(/[CGJKQSXZ]/g, '2')
    word = word.replace(/[DT]/g, '3')
    word = word.replace(/[L]/g, '4')
    word = word.replace(/[MN]/g, '5')
    word = word.replace(/[R]/g, '6')

    // Remove adjacent duplicate digits
    word = word.replace(/(.)\1+/g, '$1')

    // Pad or truncate to a length of 4
    while (word.length < 4) {
      word += '0'
    }

    return word.substring(0, 4)
  }

  /**
   * Converts an array of fields to a string representation.
   *
   * @param {Array} fields - The array of fields to convert.
   * @returns {string} - The string representation of the fields.
   */
  const fieldsToString = (fields) => {
    let fieldValues = fields.map(field => {
      return field.field
    })
    return fieldValues.join(', ')
  }

  /**
   * Converts XML text to JSON object.
   * @param {string} text - The XML text to be converted.
   * @returns {object} - The JSON object representing the XML structure.
   */
  const xmlToJSON = text => {
    const xmlNodeToJson = (xmlNode, obj) => {
      var sibling = xmlNode
      // loop through siblings
      while (sibling) {
        // skip comments
        if (sibling.nodeType == xml.NodeType.COMMENT_NODE) {
          sibling = sibling.nextSibling
          continue
        }
        // handle text nodes
        if (sibling.nodeType == xml.NodeType.TEXT_NODE) {
          if (!!sibling.nodeValue.replace(/[\n| ]/g, "")) obj[sibling.nodeName] = sibling.nodeValue
          sibling = sibling.nextSibling
          continue
        }
        var childObj = Object.create(null)
        // handle attributes
        if (!!sibling.hasAttributes()) {
          Object.keys(sibling.attributes).forEach(function(key) {
            childObj['@' + key] = sibling.getAttribute({ name: key })
          })
        }
        // handle children
        var value = xmlNodeToJson(sibling.firstChild, childObj)
        // handle multiple children with same name
        if (sibling.nodeName in obj) {
          if (!Array.isArray(obj[sibling.nodeName])) {
            obj[sibling.nodeName] = [obj[sibling.nodeName]]
          }
          obj[sibling.nodeName].push(value)
        } else {
          obj[sibling.nodeName] = value
        }
        sibling = sibling.nextSibling
      }
      return obj
    }

    var xmlDocument = xml.Parser.fromString({ text: text })
    return xmlNodeToJson(xmlDocument.firstChild, Object.create(null))
  }

  /**
   * Builds an object from a string representation of its path within another object.
   *
   * @param {object} docObject - The object containing the target object.
   * @param {string} objectTree - The string representation of the path to the target object within docObject.
   * @returns {any} - The target object found within docObject.
   */
  const buildObjectFromString = (docObject, objectTree) => {
    const loggerTitle = 'buildObjectFromString'

    try {
      let objectNameString = 'docObject'
      objectNameString = `${objectNameString}${objectTree}`
      return eval(objectNameString)
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Loads a file from the specified file path and returns its content as a parsed JSON object.
   *
   * @param {string} filePath - The path of the file to load.
   * @returns {Object} - The parsed JSON object representing the content of the file.
   */
  const loadDefinition = filePath => {
    const loggerTitle = 'loadDefinition'

    try {
      const fileObj = file.load({ id: filePath })
      const fileContent = fileObj.getContents()
      return JSON.parse(fileContent)
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Checks if a given string is a service value.
   *
   * @param {string} str - The string to be checked.
   * @returns {boolean} Returns true if the string is a service value, otherwise returns false.
   */
  const isServiceValue = (str, itemObj, fileDef) => {
    const loggerTitle = 'isServiceValue'

    try {
      let resultValue = false
      log.debug(loggerTitle, `str: ${str}`)
      const containsOnlyLetters = /^([^0-9]*)$/.test(str)
      const hasManufactureCode = itemObj[fileDef['manufacturer_code']]
      const manCodeGreaterThanThree = itemObj[fileDef['manufacturer_code']].length > 3
      if (containsOnlyLetters && (!hasManufactureCode || manCodeGreaterThanThree)) {
        resultValue = true
      }
      
      return resultValue
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Converts a list of items to a Soundex string.
   *
   * @param {string} listItems - The list of items separated by commas and spaces.
   * @returns {string} The Soundex string generated from the list of items.
   */
  const listToSoundexString = (listItems) => {
    const loggerTitle = 'listToSoundexString'

    try {
      const itemArr = listItems.split(', ')
      let soundexString = ''
      for (const item of itemArr) {
        soundexString += `SOUNDEX('${item}'), `
      }
    return soundexString
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Retrieves a value from a string by splitting it using a specified delimiter and returning the value at a specified index.
   *
   * @param {string} stringValue - The string to be split.
   * @param {string} splitterValue - The delimiter used to split the string.
   * @param {number} indexToReturn - The index of the value to be returned from the split array.
   * @returns {string} The value at the specified index from the split array.
   */
  const retrieveFromResults = (stringValue, splitterValue, indexToReturn) => {
    const loggerTitle = 'retrieveFromResults'

    try {
      const splitArray = stringValue.split(splitterValue)
      return splitArray[indexToReturn]
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Retrieves a value from a delimited string based on the specified index. - Originally developed by Joe Keller
   *
   * @param {string} stringValue - The delimited string.
   * @param {string} splitterValue - The delimiter used to split the string.
   * @param {number} indexToReturn - The index of the value to retrieve.
   * @returns {void}
   */
  const retrieveValueFromDelimitedString = (stringValue, splitterValue) => {
    const loggerTitle = 'retrieveValueFromDelimitedString'

    try {
      const ppercent = stringValue

      let discountpercent = 0

      let tiers = ppercent.split(splitterValue)

      if (tiers.length) {
        if (tiers.length == 4) {
          // if there are 4 tiers the first is the actual numeric discount, and you can ignore the rest – go figure
          ppercent = parseFloat(tiers[0]).toFixed(4)
        } else {
          // tiered discounts: could be 1, 2 or 3 tiers. example: 40|40|40 or 40|15
          // 1st is percent off list: 40 in this example. cost will be 60% of list so far. The basis is now 100-40=60.
          // A 2nd tier of 40 again would add (basis * tier2/100), example: (60 * .4 = 24). Now the total discount so far is 64, and basis is now 36.
          // A 3rd tier of 40 again would add (basis * tier3/100), example (36 * .4 = 14.4) to end up with a total discount of 78.4

          let basis = 0

          if (tiers[0] && tiers[0] > 0) {
            discountpercent = tiers[0]

            basis = 100 - discountpercent

            if (tiers[1] && tiers[1] > 0) {
              discountpercent += basis * (tiers[1] / 100)

              basis = 100 - discountpercent

              if (tiers[2] && tiers[2] > 0) {
                discountpercent += basis * (tiers[2] / 100)
              }
            }
          }
        }
      } 

      return discountpercent
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Generates a random string of the specified length.
   *
   * @param {number} length - The length of the random string to generate.
   * @returns {string} The randomly generated string.
   */
  const generateRandomString = (length) => {
    loggerTitle = 'generateRandomString'

    try {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
      }
      return result
    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }

    return null
  }

  /**
   * Adds a UUID to each item line in the given array.
   *
   * @param {Array} itemLines - The array of item lines to add UUIDs to.
   * @returns {void}
   */
  const addUUIDToItemLines = (itemLines) => {
    const loggerTitle = 'addUUIDToItemLines'

    try {
      for (let itemLine of itemLines) {
        itemLine.custcol_uuid = `${Date.now()}-${generateRandomString(10)}`
      }
    } catch (e) {
      log.error(loggerTitle, e)
    }
  }

  /**
   * Calculates the discount percentage based on the given line item.
   *
   * @param {number} lineItem - The line item to calculate the discount for.
   * @returns {number} The calculated discount percentage.
   */
  const calculateDiscount = (lineItem) => {
    let discountpercent = 0

    if (ppercent.indexOf("|") != -1) {
      let tiers = ppercent.split("|")

      if (tiers.length) {
        if (tiers.length == 4) {
          // if there are 4 tiers the first is the actual numeric discount, and you can ignore the rest – go figure
          ppercent = parseFloat(tiers[0]).toFixed(4)
        } else {
          // tiered discounts: could be 1, 2 or 3 tiers. example: 40|40|40 or 40|15
          // 1st is percent off list: 40 in this example. cost will be 60% of list so far. The basis is now 100-40=60.
          // A 2nd tier of 40 again would add (basis * tier2/100), example: (60 * .4 = 24). Now the total discount so far is 64, and basis is now 36.
          // A 3rd tier of 40 again would add (basis * tier3/100), example (36 * .4 = 14.4) to end up with a total discount of 78.4

          let basis = 0

          if (tiers[0] && tiers[0] > 0) {
            discountpercent = tiers[0]

            basis = 100 - discountpercent

            if (tiers[1] && tiers[1] > 0) {
              discountpercent += basis * (tiers[1] / 100)

              basis = 100 - discountpercent

              if (tiers[2] && tiers[2] > 0) {
                discountpercent += basis * (tiers[2] / 100)
              }
            }
          }
        }
      }
    } else if (!isNaN(ppercent)) {
      discountpercent = ppercent
    }

    return discountpercent
  }

  return {
    findIDByField: findIDByField,
    xmlToJSON: xmlToJSON,
    isServiceValue: isServiceValue,
    buildObjectFromString: buildObjectFromString,
    loadDefinition: loadDefinition,
    retrieveFromResults: retrieveFromResults,
    retrieveValueFromDelimitedString: retrieveValueFromDelimitedString,
    addUUIDToItemLines: addUUIDToItemLines,
    calculateDiscount: calculateDiscount,
  }

})