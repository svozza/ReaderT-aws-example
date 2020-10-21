## ReaderT-aws-example

The node.js script in `index.js` uses the `ReaderT` monad transformer (from 
[Crocks](https://crocks.dev/docs/crocks/ReaderT.html)) to pass dependencies to the effectful functions.

### To run

```bash
export AWS_REGION=<region>
export AWS_ACCESS_KEY_ID=<access key>
export AWS_SECRET_ACCESS_KEY=<secret access key>

node index.js
```