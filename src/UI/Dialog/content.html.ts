export default `
<script>
function handleResponse_<?!= data.id ?>(html) {
    if (html) {
        replaceContent(html);
    } else {
        google.script.host.close();
    }
}
</script>
<form id="dialog_<?!= data.id ?>" onsubmit="function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    for (const button of document.querySelectorAll('#dialog_<?!= data.id ?> button')) {
        button.disabled = true;
    }
    google.script.run
        .withSuccessHandler(handleResponse_<?!= data.id ?>)
        .<?!= data.functionName ?>(e.submitter.value);
    return false;
}">
    <div><?= data.message ?> </div>
    <div class="bottom-right">
        <? for (const button of data.buttons) { ?>
            <button
                class="<?= button.class ?>"
                name = "response"
                type = "submit"
                value = "<?= button.value ?>"
            >
                <?= button.name ?>
            </button>
        <? } ?>
    </div>
</form>
`;
