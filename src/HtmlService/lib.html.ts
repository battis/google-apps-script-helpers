export default `<script>
  if (!window.GAS_LIGHTER_LIB_LOADED) {
      window.replaceContent = function(html) {
          document.getElementById('content').innerHTML = html;
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
