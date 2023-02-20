export default `<script>
  if (!window.GAS_LIGHTER_LIB_LOADED) {
      window.replaceContent = function(html) {
          // https://stackoverflow.com/a/47614491/294171
          content = document.getElementById('content');
          content.innerHTML = html;
          Array.from(content.querySelectorAll("script"))
            .forEach( oldScriptEl => {
                const newScriptEl = document.createElement("script");
                Array.from(oldScriptEl.attributes).forEach( attr => {
                  newScriptEl.setAttribute(attr.name, attr.value)
                });
                const scriptText = document.createTextNode(oldScriptEl.innerHTML);
                newScriptEl.appendChild(scriptText);
                oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
            });
      }
      window.attachEvent = function(element, event, handler) {
          if (element.attachEvent) {
              element.attachEvent(event, handler);
          } else {
              element.addEventListener(event, handler);
          }
      }
      window.GAS_LIGHTER_LIB_LOADED = true;
  }
</script>`;
