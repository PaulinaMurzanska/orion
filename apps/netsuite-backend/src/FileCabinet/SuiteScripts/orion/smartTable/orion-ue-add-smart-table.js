/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/runtime'], (serverWidget, runtime) => {
  /**
   * Executes before a record is loaded in the user interface.
   *
   * @param {Object} context - The context object containing information about the current record and user event type.
   * @param {string} context.type - The user event type. Possible values are: CREATE, COPY, VIEW, EDIT, DELETE, XEDIT, APPROVE, REJECT, CANCEL, PACK, SHIP, INVOICE, PRINT, EMAIL, QUICKVIEW, FIELDCHANGED, FIELDAPPROVED, FIELDINIT, FIELDENTER, FIELDEXIT, LINEINIT, LINEENTER, LINEEXIT, SUBLISTADD, SUBLISTDELETE, SUBLISTUPDATE.
   * @param {N/ui/serverWidget.Form} context.form - The NetSuite form object.
   */
  const beforeLoad = (context) => {
    if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
      const form = context.form

      const scriptContent = runtime.getCurrentScript().getParameter({
        name: 'custscript_orion_bom_script_content'
      })

      const tabName = 'custpage_smart_table_tab'

      // Create a new tab
      const tab = form.addTab({
        id: tabName,
        label: 'Smart Table'
      })

      // Add a custom HTML field to the tab
      const tableField = form.addField({
        id: 'custpage_smart_table_html',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Custom HTML',
        container: 'custpage_smart_table_tab'
      })

      tableField.updateLayoutType({
        layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
      })

      tableField.defaultValue = scriptContent

      const defaultField = form.addField({
        id: 'custpage_set_default_tab',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Custom HTML',
      })

      defaultField.defaultValue = `
      <script type="text/javascript">
        document.addEventListener("DOMContentLoaded", function() {
          // Code to execute when the DOM is fully loaded
          var element = document.getElementById("custpage_smart_table_tab_div");
          if (element) {
            window.showmachine="${tabName}"
            ShowitemsMachine("${tabName}")
          } 
        });
      </script>
      `
    }
  }

  return {
    beforeLoad: beforeLoad
  }
})