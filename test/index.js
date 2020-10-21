const C = require('crocks');
const {Async} = C;
const {assert} = require('chai');
const rewire = require('rewire');
const index = rewire('..');

describe('index.js', () => {

    describe('run', () => {
        const flow = index.__get__('flow');

        const mockS3 = {
            myBucket: {
                Name: 'myBucket',
                Contents: [
                    {Key: 'key1'},
                    {Key: 'key2'}
                ],
                key1: {Body: 'body1'},
                key2: {Body: 'body2'}
            }
        }

        const mockS3InstanceSuccess = {
            listObjectsV2Async: ({Bucket}) => Async.Resolved(mockS3[Bucket]),
            getObjectAsync: ({Bucket, Key}) => Async.Resolved(mockS3[Bucket][Key])
        }

        it('should fail when it encounters an error listing objects', async () => {
            const mockS3InstanceListFail = {
                listObjectsV2Async: ({Bucket}) => Async.Rejected(new Error('listObjects failed')),
                getObjectAsync: ({Bucket, Key}) => Async.Resolved(mockS3[Bucket][Key])
            }

            return flow('myBucket')
                .runWith(mockS3InstanceListFail)
                .toPromise()
                .catch(err => assert.strictEqual(err.message, 'listObjects failed'));
        });

        it('should fail when it encounters an error getting objects', async () => {
            const mockS3InstanceListFail = {
                listObjectsV2Async: ({Bucket}) => Async.Resolved(mockS3[Bucket]),
                getObjectAsync: ({Bucket, Key}) => Async.Rejected(new Error('getObject failed')),
            }

            return flow('myBucket')
                .runWith(mockS3InstanceListFail)
                .toPromise()
                .catch(err => assert.strictEqual(err.message, 'getObject failed'));
        });

        it('should download all objects from given s3 bucket', async () => {
            const actual = await flow('myBucket')
                .runWith(mockS3InstanceSuccess)
                .toPromise();

            assert.deepEqual(actual, [
                {Body: 'body1'},
                {Body: 'body2'}
            ]);
        });

    });

});