# callbag-retry

Callbag operator which resubscribes to the source given amount of times.

## Example

```js
import concat from 'callbag-concat'
import fromIter from 'callbag-from-iter'
import pipe from 'callbag-pipe'
import retry from 'callbag-retry'
import subscribe from 'callbag-subscribe'
import throwError from 'callbag-throw-error'

pipe(
  concat(fromIter([1, 2, 3]), throwError(new Error('Test error.'))),
  retry(3),
  subscribe({
    next: v => {
      // will log 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3
      console.log(v)
    },
    error(err) {
      // errors with 4th `Test error.` error
    },
  }),
)
```
