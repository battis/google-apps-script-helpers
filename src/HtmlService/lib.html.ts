export default `<script>
  if (!replaceContent) {
      replaceContent = (html) => {
          document.getElementById('content').innerHTML = html;
      }
  }

  if (!attachEvent) {
      attachEvent = (element, event, handler) => {
          if (element.attachEvent) {
              element.attachEvent(event, handler);
          } else {
              element.addEventListener(event, handler);
          }
      }
  }
</script>`;
