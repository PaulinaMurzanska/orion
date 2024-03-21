/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'], (serverWidget) => {
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
        label: 'Custom HTML'
      })
      htmlField.updateLayoutType({
        layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
      })
      htmlField.defaultValue = '<p>React Code Goes Here</p>'

      // Set the tab as the default tab
      form.updateDefaultValues({
        tab: tab
      })
    }
  }

  return {
    beforeLoad: beforeLoad
  }
})