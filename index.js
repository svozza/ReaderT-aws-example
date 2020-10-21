const AWS = require('aws-sdk');
const C = require('crocks');
const {Async, ReaderT} = C;

const ReaderAsync = ReaderT(Async);

const { ask, lift, liftFn, of } = ReaderAsync;
const { fromPromise, all } = Async;

const asyncifyAllAws = module => {
    for(let prop in module) {
        if(typeof module[prop] === 'function') {
            module[prop + 'Async'] = fromPromise((...args) => module[prop](...args).promise());
        }
    }
    return module;
}

const s3 = asyncifyAllAws(new AWS.S3());

// listObjects : String -> AsyncReader AWS.S3 Object
const listObjects = Bucket => ReaderAsync(s3 => s3.listObjectsV2Async({Bucket, MaxKeys: 2}));

// listObjects : String -> AsyncReader AWS.S3 [Object]
const getObjects = C.curry((Bucket, keys) => ReaderAsync(s3 => all(keys.map(Key => s3.getObjectAsync({Bucket, Key})))));

const log = label => console.log.bind(console, label + ':')

// const flow = pipeK(
//     of,
//     listObjects,
//     //x => getObject(x.Name, x.Contents[0].Key)
//     //x => of(x.Contents.map(c => getObject(x.Name, c.Key)))
// );

const flow = bucket => ReaderAsync
    .of(bucket)
    .chain(listObjects)
    .chain(({Contents, Name}) => getObjects(Name, C.map(x => x.Key, Contents)))

module.exports = {
    run: bucket => flow(bucket).runWith(s3)
}


