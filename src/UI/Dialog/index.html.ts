export default `<html>
  <head>
    <link
      rel="stylesheet"
      href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"
    />
  </head>
  <body>
    <div id="content">
      <form id="dialog<?!= data.id ?>">
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
      function replaceContent<?!= data.id ?>(html) {
        document.getElementById('content').innerHTML = html;
      }

      function attachEvent<?!= data.id ?>(element, event, handler) {
        if (element.attachEvent) {
          element.attachEvent(event, handler);
        } else {
          element.addEventListener(event, handler);
        }
      }

      function handleResponse<?!= data.id ?>(value) {
        if (value) {
          replaceContent<?!= data.id ?>(value)
        } else {
          google.script.host.close();
        }
      }

      attachEvent<?!= data.id ?>(document.getElementById('dialog<?!= data.id ?>'), 'submit', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        for (const button of document.querySelectorAll('#dialog<?!= data.id ?> button')) {
          button.disabled = true;
        }
        google.script.run.withSuccessHandler(handleResponse<?!= data.id ?>).<?!= data.functionName ?>(e.submitter.value);
        return false;
      });
    </script>
  </body>
</html>`;
