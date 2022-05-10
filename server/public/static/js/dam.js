const baseUrl = ''
const log = console.log.bind(console)
const logErr = console.error.bind(console)
function logErrAndRethrow (err) {
  logErr(err)
  throw err
}

const http = {
  get (path) {
    return window
      .fetch(`${baseUrl}${path}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText || 'Unknown error')
        }

        return res
          .json()
          .then(json => {
            res.data = json
            log(res)
            return res
          })
      })
      .catch(logErrAndRethrow)
  },

  post (path, body) {
    return window
      .fetch(`${baseUrl}${path}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText || 'Unknown error')
        }

        return res
          .json()
          .then(json => {
            res.data = json
            log(res)
            return res
          })
      })
      .catch(logErrAndRethrow)
  }
}

function uploadToS3 (file, policy, setProgress) {
  return new Promise((resolve, reject) => {
    const fd = new window.FormData()
    for (const key in policy.fields) {
      fd.append(key, policy.fields[key])
    }

    fd.append('file', file)

    const xhr = new window.XMLHttpRequest()
    xhr.open('POST', policy.url, true)
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        setProgress(e.loaded / e.total * 100)
      }
    }

    xhr.onerror = reject
    xhr.onload = resolve

    return xhr.send(fd)
  })
}

function main () {
  const form = document.getElementById('form')
  const input = document.getElementById('file')
  const summary = document.getElementById('summary')
  const uploadRow = document.getElementById('uploadRow')

  input.addEventListener('change', function (e) {
    const files = Array.from(this.files)

    summary.textContent = ''
    files.forEach(file => {
      const row = uploadRow.content.cloneNode(true)
      row.querySelector('dt.govuk-summary-list__key').textContent = file.name
      summary.appendChild(row)
      file.row = summary.lastElementChild
    })

    summary.style.display = files.length > 0 ? '' : 'none'
  })

  form.addEventListener('submit', async function (e) {
    e.preventDefault()
    const files = Array.from(input.files)
    const payload = files.map(file => {
      const { name, size, type } = file
      return { name, size, type }
    })
    const url = new window.URL(window.location.href)
    const prefix = url.searchParams.get('prefix')
    const path = `/admin/dam/sign?prefix=${prefix}`
    const response = await http.post(path, { files: payload })

    const promises = response.data.map((item, i) => {
      const { policy } = item
      const file = files[i]
      const row = file.row
      const progress = row.querySelector('progress')
      const updateProgress = value => (progress.value = value)
      return uploadToS3(file, policy, updateProgress)
        .then(() => row.remove())
        .then(res => console.log('success', file.name, res))
    })

    Promise.all(promises).then(() => form.reset())

    return false
  })
}

main()
