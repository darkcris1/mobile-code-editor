(function () {
   const CODE_VALUE_KEY = "code_value_key";

   const defaultValue = {
      css: "body,html {\n height: 100%;\n}",
      js: "function hello(){\n alert('hello world') \n}",
      html: "<!-- Press Tab -->\n!",
   };

   const initialValue =
      JSON.parse(localStorage.getItem(CODE_VALUE_KEY)) || defaultValue;

   function saveCode({ css, js, html }) {
      localStorage.setItem(
         CODE_VALUE_KEY,
         JSON.stringify({
            css: css.getValue(),
            js: js.getValue(),
            html: html.getValue(),
         })
      );
   }

   function loadInitialCode({ editorCSS, editorHTML, editorJS }) {
      if (!initialValue) return;
      const { css, js, html } = initialValue;
      editorJS.setValue(js, 1);
      editorCSS.setValue(css, 1);
      editorHTML.setValue(html, 1);
   }
   window.saveCode = saveCode;
   window.loadInitialCode = loadInitialCode;
})();
