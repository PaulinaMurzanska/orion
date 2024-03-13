/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */

define(['N/log', 'N/query', './orionHelperLib'], function(log, query, orionHelperLib) {
  /**
   * Identify the file type of a file
   * @param {string} filePath - The path of the file
   * @returns {string} - The file type
   */
  const getFileType = (filePath) => {
    // Extract the file extension from the file path
    var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)

    // Return the file type
    return fileExtension
  }

  /**
   * Finds lines in the file definitions array that match the specified file type.
   *
   * @param {Array} fileDefs - The array of file definitions.
   * @param {string} filetype - The file type to search for.
   * @returns {Array} - An array of file definitions that match the specified file type.
   */
  const findDefLinesByType = (fileDefs, fileType) => {
    return fileDefs.filter((obj) => obj.extension === fileType)
  }

  /**
   * Finds text loops in the given file definitions, based on the provided text content and line identifier.
   * 
   * @param {Array} fileDefs - An array of file definitions.
   * @param {string} textContent - The text content to search for loops.
   * @param {string} lineIdentifier - The line identifier used to identify loops.
   * @returns {Array} - An array of split lines representing the text loops found.
   */
  const findTextLoops = (fileDefs, textContent, lineIdentifier, endIdentifier, matchGroup) => {
    for (let fileDef of fileDefs) {
      const startLine = fileDef.identifiers.split(', ')[0]
      const lineRegex = new RegExp(startLine, 'gm')
      // remove xml definition
      textContent = textContent.replace(/<\?xml.+\?>/, '')
      textContent = textContent.replace(/<(Envelope)(.+")/, '<$1')
      const linesFound = textContent.match(lineRegex)
      // if lines found, split the text content into separate array elements
      if (linesFound?.length > 0) {
        const splitLines = getLoopGroup(fileDefs, textContent, startLine, lineIdentifier, endIdentifier, matchGroup)
        return splitLines
      }
    }
  }

  /**
   * Finds text loops in the given text content based on the provided line identifier and match group.
   * 
   * @param {string} textContent - The text content to search for text loops.
   * @param {RegExp} lineIdentifier - The regular expression used to identify lines containing the desired content.
   * @param {number} matchGroup - The index of the match group in the line identifier to extract the content.
   * @returns {string[]} - An array of split lines containing the identified text loops.
   */
  const getLoopGroup = (fileDefs, textContent, lineStart, lineIdentifier, endIdentifier, matchGroup) => {
    const loggerTitle = 'findTextLoops'

    try {
      // split into array by text lines
      const textContentArr = textContent.split('\r\n')
      let foundLines = []
      let splitLines = []
      let linesStarted = []

      log.debug(loggerTitle, `textContentArr: ${textContentArr}`)
      // loop through each line of the text content
      for (let [idx, textContentLine] of textContentArr.entries()) {
        
        // find match by regular expression on each line to find the line identifier
        const contentMatch = textContentLine.match(lineIdentifier)

        // if match found return the line identifier
        if (contentMatch?.length > 0) {
          const content = contentMatch[matchGroup]
          
          // if matchgroup exists, continue
          if (content) {
            endIdentifier = endIdentifier ? endIdentifier.replace(/\{var\}/, lineStart) : null
            const endMatch = endIdentifier ? textContentLine.match(new RegExp(endIdentifier)) : null
            // if multiple instances exist split the text blocks into separate array elements
            if (content === lineStart) {
              if (endMatch?.length > 0) {
                if (!textContentArr[idx + 1] || textContentArr[idx + 1].indexOf(lineStart) === -1) {
                  foundLines.push(textContentLine)
                  splitLines.push(foundLines.join('\r\n'))
                  foundLines = []
                }
              } else {
                if (linesStarted.length > 0) {
                  splitLines.push(foundLines.join('\r\n'))
                  foundLines = []
                }
                linesStarted.push(textContentLine)
              }
            }
            if (linesStarted.length > 0) {
              foundLines.push(textContentLine)
            }
          }
        }
      }

      splitLines = splitLines?.length > 0 ? splitLines : []

      log.debug(loggerTitle, `splitLines.length: ${splitLines.length}`)

      return splitLines

    } catch (e) {
      log.error(loggerTitle, `Error: ${e.message}`)
    }
  }

  /**
   * Matches file definitions with line objects based on identifiers.
   * 
   * @param {Array<Object>} fileDefs - An array of file definitions.
   * @param {Array<Object>} lineObjs - An array of line objects.
   * @returns {Object|null} - The matched file definition or null if no match is found.
   */
  const matchDefinition = (fileDefs, lineObjs, failureLimit) => {
    const loggerTitle = 'matchDefinition'
    try {
      for (let fileDef of fileDefs) {
        const identifiers = fileDef.identifiers.split(', ')
        let matchedLines = new Set(identifiers) // Use a Set to store matched identifiers

        // Loop through each line object and identifier
        for (let i = 0; i < lineObjs.length && i < failureLimit; i++) {
          log.debug(loggerTitle, `i: ${i} `)
          const lineObj = lineObjs[i]
          for (let identifier of identifiers) {
            const identRegex = new RegExp(identifier)
            log.debug(loggerTitle, `identifier: ${identifier}, identRegex: ${identRegex}`)
            log.debug(loggerTitle, `lineObj: ${lineObj}`)
            if (lineObj.match(identifier)) {
              matchedLines.delete(identifier) // Remove matched identifier from the Set
            }
            if (matchedLines.size === 0) {
              log.debug(loggerTitle, `Matched definition: ${fileDef.name}`)
              return fileDef
            }
          }
        }
      }
      return null
    } catch (e) {
      log.error(loggerTitle, `Error: ${e.message}`)
    }
  }

  /**
   * Generates line JSON based on the provided file definition and line object.
   * 
   * @param {Object} fileDef - The file definition object.
   * @param {Object} lineObj - The line object.
   * @returns {Object|null} - The generated line JSON or null if no conversion is possible.
   */
  const generateLineJSON = (fileDef, lineObj, outputDef, orionHelperLib) => {
    const loggerTitle = 'generateLineJSON'
    try {
      log.debug(loggerTitle, `fileDef: ${JSON.stringify(fileDef)}`)
      switch (fileDef.extension) {
        case 'sif':
          return convertSIFData(fileDef, lineObj, '({var})=(.+)', outputDef, orionHelperLib)
        case 'xml':
          return convertXMLData(fileDef, lineObj, outputDef, orionHelperLib)
        default:
          return null
      }
    } catch (e) {
      log.error(loggerTitle, `Error: ${e.message}`)
    }
  }

  /**
   * Converts SIF data based on the provided parameters.
   * 
   * @param {Object} fileDef - The file definition object.
   * @param {Array} lineObjs - An array of line objects.
   * @param {string} keyValue - The key value used in regular expression.
   * @param {RegExp} valueRegex - The regular expression used to match values.
   * @param {Object} outputDef - The output definition object.
   * @returns {Object} - An array of converted line objects.
   */
  const convertSIFData = (fileDef, lineObjs, valueRegex, outputDef) => {
    const loggerTitle = 'convertSIFData'
    const fileMaps = fileDef.mapping
    let lineOutput = []
    let options = []
    let newOutputDef = JSON.parse(JSON.stringify(outputDef))
    let newOutputDefKeys = JSON.parse(JSON.stringify(outputDef.item.items[0]))
    let itemList = {}

    // Loop through each line objects
    for (let [idx, lineObj] of lineObjs.entries()) {
      let newOutputDefKeysLoop = JSON.parse(JSON.stringify(newOutputDefKeys))
      newOutputDefKeysLoop['line'] = idx
      // Loop through each file mapping
      for (let key in fileMaps) {
        // replace the variable in the valueRegex with the file mapping value
        const keyRegex = new RegExp(valueRegex.replace(/\{var\}/g, fileMaps[key]))
        // match the line object with the keyRegex
        const regexResults = lineObj.match(keyRegex)
        if (regexResults?.length > 0) {
          const value = regexResults[2]
          if (fileDef.id_maps[key]) {
            newOutputDefKeysLoop[key] = value
            itemList[key]?.length > 0 ? itemList[key].push({idx: idx, value: value}) : itemList[key] = [{idx: idx, value: value}]
          } else {
            newOutputDefKeysLoop[key] = value
          }  
        } 
        if (key === 'custcol_pintel_optioncodedescription') {
          newOutputDefKeysLoop[key] = generateSIFOptions(fileDef, lineObj, '{var}=(.+)', 1)
        }
      }

      log.debug(loggerTitle, `itemList: ${JSON.stringify(itemList)}`)

      // if first line, set the newOutputDefKeys to the first item in the newOutputDef
      if (idx === 0) {
        newOutputDef.item.items[0] = newOutputDefKeysLoop
      } else {
        newOutputDef.item.items.push(newOutputDefKeysLoop)
      }
    }

    newOutputDefKeysLoop = orionHelperLib.findIDByField(fileDef, itemList, newOutputDef.item.items)
    
    return newOutputDef
  }

  const convertXMLData = (fileDef, lineObjs, outputDef, orionHelperLib) => {
    const loggerTitle = 'convertSIFData'
    const fileMaps = fileDef.mapping
    let lineOutput = []
    let options = []
    let newOutputDef = JSON.parse(JSON.stringify(outputDef))
    let newOutputDefKeys = JSON.parse(JSON.stringify(outputDef.item.items[0]))

    // Loop through each line objects
    for (let [idx, lineObj] of lineObjs.entries()) {
      lineObj= lineObj.replace(/<([^\/:\s>]+:)/mg, '<')
      lineObj = lineObj.replace(/<\/([^:\s>]+:)/mg, '</')
      const jsonLineObject = orionHelperLib.xmlToJSON(lineObj)
      let newOutputDefKeysLoop = JSON.parse(JSON.stringify(newOutputDefKeys))
      newOutputDefKeysLoop['line'] = idx
      // Loop through each file mapping
      for (let key in fileMaps) {
        const value = orionHelperLib.buildObjectFromString(jsonLineObject, fileMaps[key])
        if (key === 'custcol_pintel_optioncodedescription') {
          newOutputDefKeysLoop[key] = generateXMLOptions(fileDef, jsonLineObject)
        } else if (fileDef.id_maps[key] && orionHelperLib.findIDByField(fileDef, key, value)) {
          log.debug(loggerTitle, `fileDef.id_maps[key]: ${fileDef.id_maps[key]}`)
          newOutputDefKeysLoop[key] = orionHelperLib.findIDByField(fileDef, key, value)
        } else {
          newOutputDefKeysLoop[key] = value
        }
      }
      // if first line, set the newOutputDefKeys to the first item in the newOutputDef
      if (idx === 0) {
        newOutputDef.item.items[0] = newOutputDefKeysLoop
      } else {
        newOutputDef.item.items.push(newOutputDefKeysLoop)
      }
    }
    
    return newOutputDef
  }

  const generateSIFOptions = (fileDef, lineObj, optRegex, optionMatchGroup) => {
    const loggerTitle = 'generateSIFOptions'
    lineObj = lineObj.split('\r\n')
    const optionParams = fileDef.mapping.custcol_pintel_optioncodedescription.split(' - ')
    const optionName = optionParams[0]
    const optValue = optionParams[1]
    
    const optNameRegex = optRegex.replace(/\{var\}/g, optionName)
    const optValRegex = optRegex.replace(/\{var\}/g, optValue)

    let optionStr = ''

    for (let line of lineObj) {

      let optionName = line.match(optNameRegex)
      optionName = optionName?.length > 0 ? optionName[optionMatchGroup] : null
      let optionValue = line.match(optValRegex)
      optionValue = optionValue?.length > 0 ? optionValue[optionMatchGroup] : null

      
      if (optionName?.length > 0) {
        optionStr += `${optionName} - `
      } else if (optionValue?.length > 0) {
        optionStr += `${optionValue}\n`
      }
    }
    log.audit(loggerTitle, `optionStr: ${optionStr}`)
    return optionStr
  }

  const generateXMLOptions = (fileDef, jsonObj) => {
    const optionParams = fileDef.mapping.custcol_pintel_optioncodedescription.split(' - ')
    const optNamePath = optionParams[0].split('[]')[1]
    const optValuePath = optionParams[1].split('[]')[1]
    const optionRoot = optionParams[0].split('[]')[0]

    const options = orionHelperLib.buildObjectFromString(jsonObj, optionRoot)

    let optionStr = ''

    for (let [idx, option] of options.entries()) {
      const optionName = orionHelperLib.buildObjectFromString(option, `${optionRoot}[${idx}]${optNamePath}`)
      const optionValue = orionHelperLib.buildObjectFromString(option, `${optionRoot}[${idx}]${optValuePath}`)
      optionStr += `${optionName} - ${optionValue}\n`
    }

    return optionStr

  }

  // Expose the public functions
  return {
    getFileType: getFileType,
    findDefLinesByType: findDefLinesByType,
    findTextLoops: findTextLoops,
    matchDefinition: matchDefinition,
    generateLineJSON: generateLineJSON,
  }
})
