/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import RxTransaction from '../../types/transaction-rx'
import { Record, ResultSummary } from 'neo4j-driver-core'
import RxResult from '../../types/result-rx'
import { of, Observer } from 'rxjs'
import { concatWith } from 'rxjs/operators'

const dummy: any = null

const stringObserver: Observer<string> = {
  next: value => console.log(value),
  complete: () => console.log('complete'),
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  error: error => console.log(`error: ${error}`)
}

const keysObserver: Observer<string[]> = {
  next: value => console.log(`keys: ${value.reduce((acc, curr) => acc + ', ' + curr, '')}`),
  complete: () => console.log('keys complete'),
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  error: error => console.log(`keys error: ${error}`)
}

const recordsObserver: Observer<Record> = {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  next: value => console.log(`record: ${value.toString()}`),
  complete: () => console.log('records complete'),
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  error: error => console.log(`records error: ${error}`)
}

const summaryObserver: Observer<ResultSummary> = {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  next: value => console.log(`summary: ${value.toString()}`),
  complete: () => console.log('summary complete'),
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  error: error => console.log(`summary error: ${error}`)
}

const tx: RxTransaction = dummy

const result1: RxResult = tx.run('RETURN 1')
result1.keys().subscribe(keysObserver)
result1.records().subscribe(recordsObserver)
result1.consume().subscribe(summaryObserver)

const result2: RxResult = tx.run('RETURN $value', { value: '42' })
result2.keys().subscribe(keysObserver)
result2.records().subscribe(recordsObserver)
result2.consume().subscribe(summaryObserver)

const isOpen: boolean = tx.isOpen()

tx.commit()
  .pipe(concatWith(of('committed')))
  .subscribe(stringObserver)

tx.rollback()
  .pipe(concatWith(of('rolled back')))
  .subscribe(stringObserver)

tx.close()
  .pipe(concatWith(of('closed')))
  .subscribe(stringObserver)
