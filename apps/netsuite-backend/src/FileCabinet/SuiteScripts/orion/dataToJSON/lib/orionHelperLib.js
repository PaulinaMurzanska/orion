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
    let whereString = ''
    let whereKeyResults = {}
    let lineLimit = 250

    const idMaps = fileDef.id_maps
    for (let idMapKey in idMaps) {
      whereKeyResults[idMapKey] = []
      for (let [idx, itemObj] of itemList[idMapKey].entries()) {
        const keyResults = itemObj
        if (idx > 0 && !/OR\s$/.test(whereString)) {
          whereString += ' OR '
        }
        let returnedString = buildWhereString(idMapKey, idMaps[idMapKey], keyResults, newOutputDefKeysLoop, whereString)
        whereString += whereString.indexOf(returnedString) === -1 ? returnedString : ''
        if (idx === lineLimit - 1 || idx === itemList[idMapKey].length - 1) {
          whereKeyResults[idMapKey] = whereKeyResults[idMapKey].concat([whereString])
          whereString = ''
        }
      }
    }

    whereKeyResults = buildHeaderString(idMaps, whereKeyResults)
    const searchResults = getSQLResults(whereKeyResults)
    newOutputDefKeysLoop = addResultsToOutput(searchResults, newOutputDefKeysLoop, idMaps)

    return newOutputDefKeysLoop

  }

  const buildWhereString = (idMapKey, idMaps, keyResults, newOutputDefKeysLoop, whereString) => {
    const loggerTitle = 'buildWhereString'
    let fields = idMaps.field
    let whereStringBlock = '('

    for (let [idx, field] of fields.entries()) {
      if (idx > 1) {
        whereStringBlock += ` ${idMaps.field_join} `
      }
      if (!idMaps.map_field) {
        whereStringBlock += isServiceValue(keyResults.value) && field.soundex ? `(SOUNDEX(${field.field}) = SOUNDEX('${keyResults.value}'))` : `(${field.field} = '${keyResults.value}')`
      } else {
        let fieldValue = newOutputDefKeysLoop[keyResults.idx][idMaps.map_field[idx]]
        if (fieldValue) {
          whereStringBlock += isServiceValue(fieldValue) && field.soundex ? `(SOUNDEX(${field.field}) = SOUNDEX('${fieldValue}'))` : `(${field.field} = '${fieldValue}')`
        }  
      }
    }
    whereStringBlock += ')'

    return whereStringBlock
  }

  const buildHeaderString = (idMaps, whereKeyResults) => {
    const loggerTitle = 'buildHeaderString'
    
    for (let idMapKey in idMaps) {
      let headerString = `SELECT ${idMaps[idMapKey].return_field}, ${fieldsToString(idMaps[idMapKey].field)} FROM ${idMaps[idMapKey].type} WHERE `
      for (let [idx, whereResults] of whereKeyResults[idMapKey].entries()) {
        let fullString = headerString + whereResults.replace(/^\s+OR\s/, '')
        whereKeyResults[idMapKey] = fullString.replace(/\sOR\s$/, '')
      }
    }

    return whereKeyResults
  }

  const getSQLResults = (whereKeyResults) => {
    let resultValues = {}
    for (let idMapKey in whereKeyResults) {
      let combinedResults = []
      for (let [idx, whereResults] of whereKeyResults[idMapKey].entries()) {
        let queryResults = query.run({ query: whereResults })
        let results = queryResults.asMappedResults()
        combinedResults = combinedResults.concat(results)
      }
      resultValues[idMapKey] = combinedResults
    }

    return resultValues
  }

  const addResultsToOutput = (resultValues, newOutputDefKeysLoop, idMaps) => {
    const loggerTitle = 'addResultsToOutput'
    for (let [idx, newOutputDefKeys] of newOutputDefKeysLoop.entries()) {
      for (let idMapKey in idMaps) {
        const toResults = []
        if (idMaps[idMapKey].map_field?.length > 0) {
          for (let [idx, field] of idMaps[idMapKey].map_field.entries()) {
            toResults.push(newOutputDefKeys[field])
          }
          let foundResult = findResultOutput(toResults, resultValues, idMaps[idMapKey])
          if (foundResult) {
            let resultField = foundResult[idMaps[idMapKey].return_field]
            let resultObj = {
              id: foundResult[resultField]
            }
            newOutputDefKeys[idMapKey] = resultObj
          }
        }
      }
    }
  }

  const findResultOutput = (toResults, searchResults, idMap) => {
    searchResults.forEach(searchResult => {
      let fromResults = []
      let soundexStrings = []
      for (let [idx, field] of idMap.field.entries()) {
        if (searchResult[field.field]) {
          fromResults.push(searchResult[field.field])
        }
        if (field.soundex) {
          soundexStrings.push(field.field)
        }
      }

      toResults = toResults.filter(toResult => {
        return toResult !== null
      }

      let foundEntries = []
      for (let [idx, toResult] of toResults.entries()) {
        if (toResult === fromResults[idx] || (soundexStrings[idx] && soundex(fromResults[idx]) === soundex(toResult)) {
          foundEntries.push(toResult)
        }

        if (idx === toResults.length - 1) {
          return foundEntries.length === toResults.length ? searchResult : null
        }
      }  
    })
  }

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
    let objectNameString = 'docObject'
    objectNameString = `${objectNameString}${objectTree}`
    return eval(objectNameString)
  }

  const loadDefinition = filePath => {
    const fileObj = file.load({ id: filePath })
    const fileContent = fileObj.getContents()
    return JSON.parse(fileContent)
  }

  const isServiceValue = (str) => {
    const loggerTitle = 'isServiceValue'
    log.debug(loggerTitle, `str: ${str}`)
    return /^([^0-9]*)$/.test(str)
  }

  const listToSoundexString = (listItems) => {
    const itemArr = listItems.split(', ')
    let soundexString = ''
    for (const item of itemArr) {
      soundexString += `SOUNDEX('${item}'), `
    }
    return soundexString
  }

  return {
    findIDByField: findIDByField,
    xmlToJSON: xmlToJSON,
    buildObjectFromString: buildObjectFromString,
    loadDefinition: loadDefinition
  }

})