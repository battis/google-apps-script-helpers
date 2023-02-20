export default `<html>
  <head>
    <link
      rel="stylesheet"
      href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"
    />
  </head>
  <body>
    <div id="content">
      <form id="dialog">
        <div><?= data.message ?></div>
        <div class="bottom-right">
          <? for (const button of data.buttons) { ?>
          <button
            class="<?= button.class ?>"
            name="response"
            type="submit"
            value="<?= button.value ?>"
          >
            <?= button.name ?>
          </button>
          <? } ?>
        </div>
      </form>
    </div>
    <script>
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

      function handleResponse(value) {
        if (value) {
          replaceContent(value)
        } else {
          google.script.host.close();
        }
      }

      attachEvent(document.getElementById('dialog'), 'submit', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        google.script.run.withSuccessHandler(handleResponse).<?!= data.functionName ?>(e.submitter.value);
        return false;
      });
    </script>
  </body>
</html>`;
