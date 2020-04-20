// helper functions that are safe to use in the browser
// from support.js file - no file system access

/**
 * remove coverage for the spec files themselves,
 * only keep "external" application source file coverage
 */
const filterSpecsFromCoverage = (totalCoverage, config = Cypress.config) => {
  const integrationFolder = config('integrationFolder')
  // @ts-ignore
  const testFilePattern = config('testFiles')

  // test files chould be:
  //  wild card string "**/*.*" (default)
  //  wild card string "**/*spec.js"
  //  list of wild card strings or names ["**/*spec.js", "spec-one.js"]
  const testFilePatterns = Array.isArray(testFilePattern)
    ? testFilePattern
    : [testFilePattern]

  const isUsingDefaultTestPattern = testFilePattern === '**/*.*'

  const isTestFile = filename => {
    const matchedPattern = testFilePatterns.some(specPattern =>
      Cypress.minimatch(filename, specPattern)
    )
    const matchedEndOfPath = testFilePatterns.some(specPattern =>
      filename.endsWith(specPattern)
    )
    return matchedPattern || matchedEndOfPath
  }

  const isInIntegrationFolder = filename =>
    filename.startsWith(integrationFolder)

  const isA = (fileCoverge, filename) => isInIntegrationFolder(filename)
  const isB = (fileCoverge, filename) => isTestFile(filename)

  const isTestFileFilter = isUsingDefaultTestPattern ? isA : isB

  const coverage = Cypress._.omitBy(totalCoverage, isTestFileFilter)
  return coverage
}

module.exports = {
  fixSourcePaths,
  filterSpecsFromCoverage
}
