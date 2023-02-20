export default `<html>
  <head>
    <link
      rel="stylesheet"
      href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"
    />
  </head>
  <body>
    <?!= include('lib', data) ?>
    <div id="content"><?!= data.content ?></div>
  </body>
</html>`;
