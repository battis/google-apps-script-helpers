export default `<script>
  if (!replaceContent) {
      console.log('defining replaceContent()')
      replaceContent = (html) => {
          document.getElementById('content').innerHTML = html;
      }
  } else {
      console.log('replaceContent() alreadu defined')
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
