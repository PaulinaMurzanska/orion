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
    console.log('idMaps', idMaps)
    for (let idMapKey in idMaps) {
      whereKeyResults[idMapKey] = []
      for (let [idx, itemObj] of itemList[idMapKey].entries()) {
        const keyResults = itemObj
        if (idx > 0) {
          whereString += ' OR '
        }
        whereString += buildWhereString(idMapKey, idMaps[idMapKey], keyResults, newOutputDefKeysLoop, whereString)
        if (idx === lineLimit - 1 || idx === itemList[idMapKey].length - 1) {
          whereKeyResults[idMapKey] = whereKeyResults[idMapKey].concat([whereString])
          whereString = ''
        }
      }
    }
    console.log('whereKeyResults', whereKeyResults)
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
        whereStringBlock += `(${field} = '${keyResults.value}' OR SOUNDEX(${field}) = SOUNDEX('${keyResults.value}'))`
      } else {
        let fieldValue = newOutputDefKeysLoop[keyResults.idx][idMaps.map_field[idx]]
        if (fieldValue) {
          whereStringBlock += `(${field} = '${fieldValue}' OR SOUNDEX(${field}) = SOUNDEX('${fieldValue}'))`
        }  
      }
    }
    whereStringBlock += ')'

    // const suiteQL = `
    //   SELECT ${idMaps[field].return_field}
    //   FROM ${idMaps[field].type}
    //   WHERE ${whereString}
    // `

    // log.debug(loggerTitle, `suiteQL: ${suiteQL}`)
    // const queryResults = query.runSuiteQL(suiteQL).asMappedResults()
    // return queryResults?.length > 0 ? queryResults[0] : null

    return whereStringBlock
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