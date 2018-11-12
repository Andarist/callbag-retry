export default function retry(max = -1) {
  return source => (start, sink) => {
    if (start !== 0) return
    let inited = false
    let retries = max
    let sourceTalkback
    let talkback = (type, data) => {
      sourceTalkback(type, data)
    }
    const subscribe = () => {
      source(0, (type, data) => {
        if (type === 0) {
          sourceTalkback = data

          if (inited) {
            // this pull probably shouldn't be unconditional
            // but I'm not sure how to track if we should pull or not at the moment
            talkback(1)
            return
          }

          inited = true
          sink(0, talkback)
          return
        }

        if (type === 2 && data) {
          if (retries !== 0) {
            retries--
            subscribe()
            return
          }
        }

        sink(type, data)
      })
    }
    subscribe()
  }
}
