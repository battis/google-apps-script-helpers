export default `<script>
  console.log('lib loaded')
  if (!window.replaceContent) {
      console.log('defining replaceContent()')
      window.replaceContent = (html) => {
          document.getElementById('content').innerHTML = html;
      }
  } else {
      console.log('replaceContent() alreadu defined')
  }

  if (!window.attachEvent) {
      window.attachEvent = (element, event, handler) => {
          if (element.attachEvent) {
              element.attachEvent(event, handler);
          } else {
              element.addEventListener(event, handler);
          }
      }
  }
</script>`;
