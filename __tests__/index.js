import concat from 'callbag-concat'
import fromIter from 'callbag-from-iter'
import pipe from 'callbag-pipe'
import subscribe from 'callbag-subscribe'
import throwError from 'callbag-throw-error'

import retry from '../src'

test('retries correct amount of times and then errors', () => {
  const actual = []

  pipe(
    concat(fromIter([1, 2, 3]), throwError(new Error('Test error.'))),
    retry(3),
    subscribe({
      next: v => actual.push(v),
      error(err) {
        expect(actual).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3])
        expect(err.message).toBe('Test error.')
      },
    }),
  )
})

test('keeps retries counter per subscription', () => {
  const retry2 = retry(2)

  const run = () => {
    const actual = []
    pipe(
      concat(fromIter([1, 2]), throwError(new Error('Test error.'))),
      retry2,
      subscribe({
        next: v => actual.push(v),
        error(err) {
          expect(actual).toEqual([1, 2, 1, 2, 1, 2])
          expect(err.message).toBe('Test error.')
        },
      }),
    )
  }

  run()
  run()
})
