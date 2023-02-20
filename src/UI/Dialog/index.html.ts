export default `<html>
  <head>
    <link
      rel="stylesheet"
      href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"
    />
  </head>
  <body>
    <div id="content">
      <form id="dialog_<?!= data.id ?>">
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
      function replaceContent_<?!= data.id ?>(html) {
        document.getElementById('content').innerHTML = html;
      }

      function attachEvent_<?!= data.id ?>(element, event, handler) {
        if (element.attachEvent) {
          element.attachEvent(event, handler);
        } else {
          element.addEventListener(event, handler);
        }
      }

      function handleResponse_<?!= data.id ?>(value) {
        if (value) {
          replaceContent_<?!= data.id ?>(value)
        } else {
          google.script.host.close();
        }
      }

      attachEvent_<?!= data.id ?>(document.getElementById('dialog_<?!= data.id ?>'), 'submit', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        for (const button of document.querySelectorAll('#dialog_<?!= data.id ?> button')) {
          button.disabled = true;
        }
        google.script.run.withSuccessHandler(handleResponse_<?!= data.id ?>).<?!= data.functionName ?>(e.submitter.value);
        return false;
      });
    </script>
  </body>
</html>`;
