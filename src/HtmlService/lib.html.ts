export default `<script>
  function replaceContent(html) {
    document.getElementById('content').innerHTML = html;
  }

  function attachEvent(element, event, handler) {
    if (element.attachEvent) {
      element.attachEvent(event, handler);
    } else {
      element.addEventListener(event, handler);
    }
  }
</script>`;
