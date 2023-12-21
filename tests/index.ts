// Optional for easier use.
var QUnit = QUnitGS2.QUnit;

// HTML get function
function doGet() {
  QUnitGS2.init();

  /**
   * Add your test functions here.
   */

  QUnit.start();
  return QUnitGS2.getHtml();
}

// Retrieve test results when ready.
function getResultsFromServer() {
  return QUnitGS2.getResultsFromServer();
}
