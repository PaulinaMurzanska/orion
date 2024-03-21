/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'], (serverWidget) => {
  /**
   * Executes before a record is loaded in the user interface.
   *
   * @param {Object} context - The context object containing information about the current record and user event type.
   * @param {string} context.type - The user event type. Possible values are: CREATE, COPY, VIEW, EDIT, DELETE, XEDIT, APPROVE, REJECT, CANCEL, PACK, SHIP, INVOICE, PRINT, EMAIL, QUICKVIEW, FIELDCHANGED, FIELDAPPROVED, FIELDINIT, FIELDENTER, FIELDEXIT, LINEINIT, LINEENTER, LINEEXIT, SUBLISTADD, SUBLISTDELETE, SUBLISTUPDATE.
   * @param {N/ui/serverWidget.Form} context.form - The NetSuite form object.
   */
  const beforeLoad = (context) => {
    if (context.type === context.UserEventType.VIEW) {
      const form = context.form

      // Create a new tab
      const tab = form.addTab({
        id: 'custpage_smart_table_tab',
        label: 'Smart Table'
      })

      // Add a custom HTML field to the tab
      const htmlField = form.addField({
        id: 'custpage_smart_table_html',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Custom HTML',
        container: 'custpage_smart_table_tab'
      })

      htmlField.updateLayoutType({
        layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
      })
      
      htmlField.defaultValue = '<p>React Code Goes Here</p>'
    }
  }

  return {
    beforeLoad: beforeLoad
  }
})