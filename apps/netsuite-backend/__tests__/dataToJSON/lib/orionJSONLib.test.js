const fs = require('fs')
const path = require('path')
const orionJSONLib = require('SuiteScripts/orion/dataToJSON/lib/orionJSONLib')
const orionHelperLib = require('SuiteScripts/orion/dataToJSON/lib/orionHelperLib')
const def = require('SuiteScripts/orion/dataToJSON/fileDefinitions.json')
const outDef = require('SuiteScripts/orion/dataToJSON/jsonOutputDefinition.json')
const fileDefs = def.fileDefinitions
const failureLimit = def.failureLimit

beforeEach(() => {
  jest.clearAllMocks()
})

const testSIFile = fs.readFileSync(path.resolve(__dirname, '../500linesHMIKNO-CAPStudio.sif'), 'utf8')
const testSIFile2 = fs.readFileSync(path.resolve(__dirname, '../2000linesCapStudio.sif'), 'utf8')

const testXMLFile = fs.readFileSync(path.resolve(__dirname, '../OFDA XML 4.0.xml'), 'utf16le')

describe('orionJSONLib - getFileType - File Type Check', () => {
  it('CAP Studio - is sif file', () => {
    const fileName = '500linesHMIKNO-CAPStudio.sif'
    const extensionName = orionJSONLib.getFileType(fileName)
    expect(extensionName).toBe('sif')
  })
  it('CAP Studio Alt - is sif file', () => {
    const fileName = '2000linesCapStudio.sif'
    const extensionName = orionJSONLib.getFileType(fileName)
    expect(extensionName).toBe('sif')
  })
  it('is xml file', () => {
    const fileName = 'OFDA XML 4.0.xml'
    const extensionName = orionJSONLib.getFileType(fileName)
    expect(extensionName).toBe('xml')
  })
})

describe('orionJSONLib - findDefLinesByType - Find File Definition by Type', () => {
  it('finds file definition by sif type', () => {
    const fileType = 'sif'
    const fileDefLines = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    expect(fileDefLines.length).toBeGreaterThan(0)
    expect(fileDefLines[0].extension).toBe('sif')
  })
  it('finds file definition by xml type', () => {
    const fileType = 'xml'
    const fileDefLines = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    expect(fileDefLines.length).toBeGreaterThan(0)
    expect(fileDefLines[0].extension).toBe('xml')
  })
  it('does not find file definition by txt type', () => {
    const fileType = 'txt'
    const fileDefLines = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    expect(fileDefLines.length).toBe(0)
  })
})

describe('orionJSONLib - findTextLoops - Find Text Loops in File', () => {
  it('CAP Studio - return array of line strings for sif', () => {
    const fileType = 'sif'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testSIFile, /^(.+)=/, null, 1)
    expect(textLoops.length).toBeGreaterThan(0)
  })
  it('CAP Studio Alt - return array of line strings for sif', () => {
    const fileType = 'sif'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testSIFile2, /^(.+)=/, null, 1)
    expect(textLoops.length).toBeGreaterThan(0)
  })
  it('return array of line strings for xml', () => {
    const fileType = 'xml'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testXMLFile, /(<.+:|<)(.+)>.*(<|)/, '(<\/.+:|<)({var})>', 2)
    expect(textLoops.length).toBeGreaterThan(0)
  })
})

describe('orionJSONLib - matchDefinition - Find Matching Definition', () => {
  it('CAP Studio - finds matching definition for sif', () => {
    const fileType = 'sif'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testSIFile, /^(.+)=/, null, 1)
    const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)
    expect(definition.name).toBe('CAP Studio')
  })
  it('CAP Studio Alt - finds matching definition for sif', () => {
    const fileType = 'sif'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testSIFile2, /^(.+)=/, null, 1)
    const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)
    expect(definition.name).toBe('CAP Studio Alt')
  })
  it('finds matching definition for xml', () => {
    const fileType = 'xml'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testXMLFile, /(<.+:|<)(.+)>.*(<|)/, '(<\/.+:|<)({var})>', 2)
    const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)
    expect(definition.name).toBe('OFDA XML')
  })
})

describe('orionJSONLib - generateLineJSON - Generate Line JSON', () => {
  // it('CAP Studio - generates line JSON for sif', () => {
  //   const fileType = 'sif'
  //   const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
  //   const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testSIFile, /^(.+)=/, null, 1)
  //   const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)

  //   let idsGenerated = []

  //   const lineJSON = orionJSONLib.generateLineJSON(definition, textLoops, outDef)

  //   // check for existance of item in array
  //   expect(idsGenerated).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining(lineJSON.item.items[0].item)
  //     ])
  //   )

  //   // check for existance of item in array
  //   expect(idsGenerated).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining(lineJSON.item.items[0].povendor)
  //     ])
  //   )

  //   expect(lineJSON.item.items.length).toBeGreaterThan(0)
  // })
  it('CAP Studio Alt - generates line JSON for sif', () => {
    const fileType = 'sif'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testSIFile, /^(.+)=/, null, 1)
    const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)

    let idsGenerated = []

    const lineJSON = orionJSONLib.generateLineJSON(definition, textLoops, outDef)

    // check for existance of item in array
    expect(idsGenerated).toEqual(
      expect.arrayContaining([
        expect.objectContaining(lineJSON.item.items[0].item)
      ])
    )

    // check for existance of item in array
    expect(idsGenerated).toEqual(
      expect.arrayContaining([
        expect.objectContaining(lineJSON.item.items[0].povendor)
      ])
    )

    expect(lineJSON.item.items.length).toBeGreaterThan(0)
  })
  it('generates line JSON for xml', () => {
    const fileType = 'xml'
    const filteredFileDefs = orionJSONLib.findDefLinesByType(fileDefs, fileType)
    const textLoops = orionJSONLib.findTextLoops(filteredFileDefs, testXMLFile, /^\s+(<.+:|<)(.+)>.*(<|)/, '(<\/.+:|<)({var})>', 2)
    const definition = orionJSONLib.matchDefinition(filteredFileDefs, textLoops, failureLimit)
    
    let idsGenerated = []

    const lineJSON = orionJSONLib.generateLineJSON(definition, textLoops, outDef)

    // check for existance of item in array
    expect(idsGenerated).toEqual(
      expect.arrayContaining([
        expect.objectContaining(lineJSON.item.items[0].item)
      ])
    )

    // check for existance of item in array
    expect(idsGenerated).toEqual(
      expect.arrayContaining([
        expect.objectContaining(lineJSON.item.items[0].povendor)
      ])
    )

    expect(lineJSON.item.items.length).toBeGreaterThan(0)
  })
})

