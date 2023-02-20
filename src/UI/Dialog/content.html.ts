export default `
<form id="dialog_<?!= data.id ?>" >
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
<script>

function handleResponse_<?!= data.id ?>(html) {
    if (html) {
        replaceContent(html);
    } else {
        google.script.host.close();
    }
}

attachEvent(document.getElementById('dialog_<?!= data.id ?>'), 'submit', function(e) {
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
});

</script>
`;
