## ReaderT-aws-example

The node.js script in `index.js` uses the `ReaderT` monad transformer (from 
[Crocks](https://crocks.dev/docs/crocks/ReaderT.html)) to pass dependencies to the effectful functions.
The monad stack comprises the [Reader](https://crocks.dev/docs/crocks/Reader.html) and [Async](https://crocks.dev/docs/crocks/Async.html) 
monads. The exported `run` function will retrieve all the objects in a specified S3 Bucket.

### To use

Ensure you have these variables set in your shell

```bash
export AWS_REGION=<region>
export AWS_ACCESS_KEY_ID=<access key>
export AWS_SECRET_ACCESS_KEY=<secret access key>
```

Then consume the `run` function

```js
const {run} = require('index');

const log = label => console.log.bind(console, label + ':');

// using Crocks Async ADT
run('myBucket').fork(log('rej'), log('res'));

// using async / await
const objects = await run('myBucket').toPromise();
console.log(objects);
```

### Running unit tests

```bash
npm test
```