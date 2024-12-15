/* Based on https://github.com/lilibraries/hooks/tree/master licensed under:
  MIT License

  Copyright (c) 李蔚生.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
import { useCallback, useEffect, useRef } from 'react';
// @ts-expect-error There are no type declarations for this package.
import raf from 'raf';

function useUnmount(effect: () => void) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    return () => {
      effectRef.current();
    };
  }, []);
}

function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

function usePersist<T extends (...args: any[]) => any>(callback: T) {
  const resultRef = useRef<(...args: Parameters<T>) => ReturnType<T>>(null);
  const callbackRef = useLatestRef(callback);

  if (!resultRef.current) {
    resultRef.current = function (this: any, ...args) {
      return callbackRef.current.apply(this, args);
    };
  }

  return resultRef.current;
}

export function useAnimation(
  callback: (percent: number) => void,
  duration: number,
  algorithm: (percent: number) => number
) {
  const timerRef = useRef(0);
  const startTimeRef = useRef(0);
  const callbackRef = useLatestRef(callback);

  const step = usePersist((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    let percent = duration > 0 ? elapsed / duration : 1;

    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;

    if (percent < 1) {
      timerRef.current = raf(step);
    }

    if (algorithm) {
      callbackRef.current(algorithm(percent));
    } else {
      callbackRef.current(percent);
    }
  });

  const cancel = useCallback(() => {
    if (timerRef.current) {
      raf.cancel(timerRef.current);
      timerRef.current = 0;
    }
    startTimeRef.current = 0;
  }, []);

  const start = usePersist(() => {
    cancel();
    timerRef.current = raf(step);
  });

  useUnmount(cancel);

  return [start, cancel] as const;
}
