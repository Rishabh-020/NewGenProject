const { spawn } = require('child_process')
const path       = require('path')

// Path to our OpenCV Python script
const DIFF_SCRIPT = path.join(__dirname, '../scripts/diff.py')

/**
 * Run OpenCV diff between two images
 *
 * HOW IT WORKS:
 * 1. Node.js spawns a Python child process
 * 2. Passes both image file paths as arguments
 * 3. Python runs OpenCV pipeline and prints JSON to stdout
 * 4. Node.js reads stdout and parses the JSON
 * 5. Returns array of regions with bbox, severity, color, issue_type
 *
 * @param {string} figmaPath - absolute path to figma image on disk
 * @param {string} livePath  - absolute path to live screenshot on disk
 * @returns {Promise<{ regions, total, summary }>}
 */
const runDiff = (figmaPath, livePath) => {
  return new Promise((resolve, reject) => {

    // spawn python3 process with diff.py script and both image paths
    const py = spawn('python', [DIFF_SCRIPT, figmaPath, livePath])

    let stdout = ''   // collects normal output (our JSON result)
    let stderr = ''   // collects error output

    // collect stdout chunks as they stream in
    py.stdout.on('data', (chunk) => { stdout += chunk.toString() })

    // collect any error messages
    py.stderr.on('data', (chunk) => { stderr += chunk.toString() })

    // when Python process finishes
    py.on('close', (exitCode) => {

      // non-zero exit code means Python crashed
      if (exitCode !== 0) {
        return reject(new Error(
          `diff.py crashed with exit code ${exitCode}: ${stderr}`
        ))
      }

      // parse the JSON output from Python
      try {
        const result = JSON.parse(stdout)

        // check if Python returned an error object
        if (result.error) {
          return reject(new Error(result.error))
        }

        // success — return regions array + summary counts
        resolve({
          regions: result.regions || [],
          total:   result.total   || 0,
          summary: result.summary || { high: 0, medium: 0, low: 0 }
        })

      } catch (parseError) {
        reject(new Error(
          `Could not parse diff.py output as JSON. Got: ${stdout.slice(0, 200)}`
        ))
      }
    })

    // handle if Python process itself fails to start (e.g. python3 not installed)
    py.on('error', (err) => {
      reject(new Error(
        `Failed to start Python process. Is python3 installed? Error: ${err.message}`
      ))
    })
  })
}

module.exports = { runDiff }
