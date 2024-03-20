const orionHelperLib = require('SuiteScripts/orion/dataToJSON/lib/orionHelperLib')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('orionJSONLib - buildObjectFromString - Build Return String', () => {
  it('string returns proper parameter', () => {
    const documentTree = {"OrderLineItem":{"VendorRef":{"@EnterpriseRef":"HMI","#text":"HMI"},"Status":{"#text":"OtherStatus"},"OtherStatus":{"#text":"NeedsUpdate"},"Quantity":{"#text":"1"},"LineItemNumber":{"#text":"1"},"Price":{"PublishedPrice":{"#text":"1679.00"},"PublishedPriceExt":{"#text":"1679.00"},"EndCustomerPrice":{"#text":"1679.00"},"EndCustomerPriceExt":{"#text":"1679.00"},"OrderDealerPrice":{"#text":"1679.00"},"OrderDealerPriceExt":{"#text":"1679.00"},"OrderDealerDiscount":{"#text":"0.000"},"EndCustomerDiscount":{"#text":"0.000"}},"Tag":[{"Type":{"#text":"CatalogTag1"},"Value":{"#text":"CATALOG TAG 1"}},{"Type":{"#text":"CatalogTag2"},"Value":{"#text":"CATALOG TAG 2"}},{"Type":{"#text":"Tag"},"Value":{"#text":"TAG"}},{"Type":{"#text":"Generic"},"Value":{"#text":"IV-GENERIC"}},{"Type":{"#text":"Alias1"},"Value":{"#text":"TAG 2"}},{"Type":{"#text":"Alias2"},"Value":{"#text":"ALIAS 2 "}},{"Type":{"#text":"Alias3"},"Value":{"#text":"ALIAS 3"}},{"Type":{"#text":"Building"},"Value":{"#text":"BUILDING"}},{"Type":{"#text":"Floor"},"Value":{"#text":"FLOOR"}},{"Type":{"#text":"Department"},"Value":{"#text":"DESPARTMENT"}},{"Type":{"#text":"Person"},"Value":{"#text":"PERSON"}},{"Type":{"#text":"FinishCode"},"Value":{"#text":"FINISH CODE"}}],"SpecItem":{"Number":{"#text":"DT1AS.2448LA"},"Alias":{"Type":{"#text":"NumberAndOptions"},"Number":{"#text":"DT1AS.2448LA29298Q20NTG"}},"Description":{"#text":"+Everywhere Rectangular Table,Squared Edge,Lam Top/Thermo Edge,T-Leg w/Hgt Adj 24D 48W    "},"PackageCount":{"#text":"1"},"Catalog":{"Code":{"#text":"HGN"}},"Option":[{"@Level":"1","@Sequence":"1","Code":{"#text":"29"},"GroupCode":{"#text":"0010951286"},"GroupDescription":{"#text":"Top Finish"},"Description":{"#text":"+misted"}},{"@Level":"1","@Sequence":"2","Code":{"#text":"29"},"GroupCode":{"#text":"0016107310"},"GroupDescription":{"#text":"Edge Finish"},"Description":{"#text":"+misted"}},{"@Level":"1","@Sequence":"3","Code":{"#text":"8Q"},"GroupCode":{"#text":"0014485601"},"GroupDescription":{"#text":"Leg Finish"},"Description":{"#text":"+folkstone grey"}},{"@Level":"1","@Sequence":"4","Code":{"#text":"20"},"GroupCode":{"#text":"0004129947"},"GroupDescription":{"#text":"Casters/Glides"},"Description":{"#text":"+casters"}},{"@Level":"1","@Sequence":"5","Code":{"#text":"NTG"},"GroupCode":{"#text":"0009329506"},"GroupDescription":{"#text":"Grommets"},"Description":{"#text":"+no grommet"}}],"UserDefined":[{"@Type":"CatalogLocation","#text":"Everywhere™ Tables > Standard-Height Tables > +Rect Table >      @squared-edge > @24\" deep > @48\" wide > +laminate top/thermoplastic edge > +T-leg with height      adjustment"},{"@Type":"QuoteNumber","#text":"QUOTE #"}]}}}

    const itemNumber = orionHelperLib.buildObjectFromString(documentTree, "['OrderLineItem']['SpecItem']['Number']['#text']")
    expect(itemNumber).toBe('DT1AS.2448LA')
  })
})